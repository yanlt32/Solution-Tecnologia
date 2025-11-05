// Dados de exemplo - substitua por sua lógica real de banco de dados
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'Administrador', name: 'Administrador' },
  { id: 2, username: 'professor', password: 'prof123', role: 'Professor', name: 'Carlos Silva' },
  { id: 3, username: 'aluno', password: 'aluno123', role: 'Aluno', name: 'João Santos' }
];

let incidents = [];
let processes = [];
let requests = [];

// Funções de autenticação
function authenticateUser(username, password) {
  return users.find(user => 
    user.username === username && user.password === password
  );
}

// Funções para incidentes
function getIncidents(userRole) {
  // Lógica de filtragem baseada no papel do usuário
  if (userRole === 'Administrador') {
    return incidents;
  } else if (userRole === 'Professor') {
    return incidents.filter(inc => inc.priority !== 'Alta');
  } else {
    return incidents.filter(inc => inc.user === username);
  }
}

function addIncident(incident) {
  incidents.push(incident);
  return incident;
}

function updateIncident(id, updates) {
  const index = incidents.findIndex(inc => inc.id === id);
  if (index !== -1) {
    incidents[index] = { ...incidents[index], ...updates };
    return true;
  }
  return false;
}

function deleteIncident(id) {
  const index = incidents.findIndex(inc => inc.id === id);
  if (index !== -1) {
    incidents.splice(index, 1);
    return true;
  }
  return false;
}

// Funções para processos
function getProcesses() {
  return processes;
}

function addProcess(process) {
  processes.push(process);
  return process;
}

// Funções para requisições LGPD
function getRequests(userRole) {
  if (userRole === 'Administrador') {
    return requests;
  } else {
    return requests.filter(req => req.assignedTo === currentUser.username);
  }
}

function addRequest(request) {
  requests.push(request);
  return request;
}

module.exports = {
  authenticateUser,
  getIncidents,
  addIncident,
  updateIncident,
  deleteIncident,
  getProcesses,
  addProcess,
  getRequests,
  addRequest
};