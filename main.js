const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let mainWindow;
let currentUser = null;

// Configuração do caminho de dados
const dataPath = path.join(__dirname, 'data');

// Funções para manipulação de arquivos JSON
async function ensureDataDirectory() {
  try {
    await fs.access(dataPath);
  } catch {
    await fs.mkdir(dataPath, { recursive: true });
  }
}

async function readData(fileName) {
  try {
    const filePath = path.join(dataPath, fileName);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Retorna array vazio se o arquivo não existir
    return [];
  }
}

async function writeData(fileName, data) {
  try {
    const filePath = path.join(dataPath, fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Erro ao escrever em ${fileName}:`, error);
    return false;
  }
}

// Função para verificar se um arquivo existe
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Função para verificar a estrutura de diretórios
async function checkDirectoryStructure() {
  try {
    const baseDirs = [
      __dirname,
      path.join(__dirname, 'src'),
      path.join(__dirname, 'src', 'views'),
      path.join(__dirname, 'src', 'views', 'adm'),
      path.join(__dirname, 'src', 'views', 'usuario')
    ];

    console.log('=== VERIFICAÇÃO DA ESTRUTURA DE DIRETÓRIOS ===');
    for (const dir of baseDirs) {
      const exists = await fileExists(dir);
      console.log(`Diretório ${exists ? 'EXISTE' : 'NÃO EXISTE'}: ${dir}`);
      
      if (exists) {
        try {
          const items = await fs.readdir(dir);
          console.log(`  Conteúdo: ${items.join(', ')}`);
        } catch (err) {
          console.log(`  Não foi possível ler o conteúdo: ${err.message}`);
        }
      }
    }
    console.log('=== FIM DA VERIFICAÇÃO ===');
  } catch (error) {
    console.error('Erro na verificação:', error);
  }
}

// Função para criar a janela principal
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    },
    show: false,
    titleBarStyle: 'default',
    icon: path.join(__dirname, 'src', 'img', '12.png')
  });

  mainWindow.removeMenu();

  // Carrega a página de login
  mainWindow.loadFile(path.join(__dirname, 'src', 'login.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Inicialização da aplicação
app.whenReady().then(async () => {
  await ensureDataDirectory();
  
  // Verificar estrutura de diretórios no startup
  await checkDirectoryStructure();
  
  createWindow();
});

// Handlers IPC - Comunicação entre processos
ipcMain.handle('login', async (event, { username, password, userType }) => {
  try {
    console.log('=== TENTATIVA DE LOGIN ===');
    console.log('Username:', username);
    console.log('UserType selecionado:', userType);

    const users = await readData('users.json');
    console.log('Usuários encontrados:', users.length);

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      console.log('Usuário não encontrado ou senha incorreta');
      return { success: false, message: 'Usuário ou senha inválidos' };
    }

    console.log('Usuário encontrado:', user);

    // Validação do role
    const role = user.role ? user.role.toLowerCase() : '';
    const selectedType = userType.toLowerCase();

    console.log('Role do usuário:', role);
    console.log('Tipo selecionado:', selectedType);

    // Validação de permissões
    if (selectedType === 'admin' && role !== 'administrador' && role !== 'admin') {
      return { success: false, message: 'Você não tem permissão de administrador.' };
    }
    if (selectedType === 'user' && (role === 'administrador' || role === 'admin')) {
      return { success: false, message: 'Use o login de administrador para este usuário.' };
    }

    currentUser = user;

    // Determinar qual dashboard carregar
    let dashboardFile;
    let dashboardType;
    
    if (selectedType === 'admin') {
      dashboardFile = path.join(__dirname, 'src', 'views', 'adm', 'dashboard-adm.html');
      dashboardType = 'admin';
    } else {
      dashboardFile = path.join(__dirname, 'src', 'views', 'usuario', 'dashboard-user.html');
      dashboardType = 'user';
    }

    console.log('Dashboard a ser carregado:', dashboardFile);
    console.log('Tipo de dashboard:', dashboardType);

    // Verificar se o arquivo existe
    const exists = await fileExists(dashboardFile);
    console.log('Arquivo existe?', exists);

    if (!exists) {
      console.log('=== ARQUIVO NÃO ENCONTRADO - VERIFICANDO ALTERNATIVAS ===');
      
      // Tentar encontrar arquivos alternativos
      const possibleFiles = [];
      
      if (dashboardType === 'admin') {
        possibleFiles.push(
          path.join(__dirname, 'src', 'views', 'adm', 'dashboard-adm.html'),
          path.join(__dirname, 'src', 'views', 'admin', 'dashboard-admin.html'),
          path.join(__dirname, 'src', 'views', 'admin', 'dashboard-adm.html'),
          path.join(__dirname, 'src', 'dashboard-adm.html'),
          path.join(__dirname, 'src', 'admin-dashboard.html')
        );
      } else {
        possibleFiles.push(
          path.join(__dirname, 'src', 'views', 'usuario', 'dashboard-user.html'),
          path.join(__dirname, 'src', 'views', 'user', 'dashboard-user.html'),
          path.join(__dirname, 'src', 'views', 'usuario', 'dashboard-usuario.html'),
          path.join(__dirname, 'src', 'dashboard-user.html'),
          path.join(__dirname, 'src', 'user-dashboard.html')
        );
      }

      for (const file of possibleFiles) {
        const fileExists = await fileExists(file);
        console.log(`Alternativa ${fileExists ? 'EXISTE' : 'não existe'}: ${file}`);
        if (fileExists) {
          dashboardFile = file;
          console.log(`Usando alternativa: ${dashboardFile}`);
          break;
        }
      }

      // Se ainda não encontrou, fazer verificação completa
      if (!await fileExists(dashboardFile)) {
        await checkDirectoryStructure();
        return { 
          success: false, 
          message: `Dashboard não encontrado. Verifique se os arquivos existem na pasta src/views/` 
        };
      }
    }

    // Tentar carregar o arquivo
    try {
      console.log('Tentando carregar:', dashboardFile);
      await mainWindow.loadFile(dashboardFile);
      console.log('Dashboard carregado com sucesso!');
      
      return { 
        success: true, 
        user: {
          username: user.username,
          role: user.role,
          name: user.name || user.username
        }
      };
    } catch (loadError) {
      console.error('Erro ao carregar o dashboard:', loadError);
      return { 
        success: false, 
        message: `Erro ao carregar o dashboard: ${loadError.message}` 
      };
    }
    
  } catch (error) {
    console.error('Erro no login:', error);
    return { 
      success: false, 
      message: 'Erro interno do sistema' 
    };
  }
});

// Handler para logout
ipcMain.handle('logout', async () => {
  try {
    currentUser = null;
    await mainWindow.loadFile(path.join(__dirname, 'src', 'login.html'));
    return { success: true };
  } catch (error) {
    console.error('Erro no logout:', error);
    return { success: false, message: 'Erro ao fazer logout' };
  }
});

// Handler para obter usuário atual
ipcMain.handle('get-current-user', () => {
  return currentUser ? {
    username: currentUser.username,
    role: currentUser.role,
    name: currentUser.name || currentUser.username
  } : null;
});

// Handler para verificar estrutura (para debugging)
ipcMain.handle('debug-check-structure', async () => {
  await checkDirectoryStructure();
  return { success: true };
});

// Handler para criar usuário de exemplo (para testes)
ipcMain.handle('create-sample-user', async () => {
  try {
    const users = await readData('users.json');
    
    // Verificar se já existe um admin
    const adminExists = users.some(u => 
      u.role && (u.role.toLowerCase() === 'administrador' || u.role.toLowerCase() === 'admin')
    );

    if (!adminExists) {
      users.push({
        username: 'admin',
        password: 'admin123',
        role: 'Administrador',
        name: 'Administrador',
        email: 'admin@system.com',
        createdAt: new Date().toISOString()
      });
      
      await writeData('users.json', users);
      console.log('Usuário admin criado: admin / admin123');
    }

    // Verificar se já existe um usuário normal
    const userExists = users.some(u => 
      u.role && u.role.toLowerCase() === 'usuario'
    );

    if (!userExists) {
      users.push({
        username: 'usuario',
        password: 'user123',
        role: 'Usuario',
        name: 'Usuário Teste',
        email: 'user@system.com',
        createdAt: new Date().toISOString()
      });
      
      await writeData('users.json', users);
      console.log('Usuário normal criado: usuario / user123');
    }

    return { 
      success: true, 
      users: users.map(u => ({ username: u.username, role: u.role }))
    };
  } catch (error) {
    console.error('Erro ao criar usuários de exemplo:', error);
    return { success: false, message: error.message };
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Log para verificar o diretório atual ao iniciar
console.log('Diretório da aplicação:', __dirname);


