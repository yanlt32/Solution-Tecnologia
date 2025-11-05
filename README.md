# Solution Tecnologia - Sistema de Gestão
<img width="500" height="500" alt="SoluTIon png_1_-removebg-preview" src="https://github.com/user-attachments/assets/3220c0c7-d078-45d6-a12e-a85630871e6b" />

Sistema completo de gestão empresarial com dashboard administrativo, painel do usuário e quiz gamificado.

## 🚀 Funcionalidades

### Administração
- Dashboard com métricas e gráficos
- Gerenciamento de incidentes ITIL
- Controle de requisições LGPD
- Monitoramento de sistema
- Relatórios detalhados

### Usuário
- Dashboard personalizado
- Abertura de chamados
- Solicitações LGPD
- Suporte técnico
- Quiz gamificado

### Quiz Gamificado
- Perguntas sobre Governança de TI
- Sistema de pontuação com ranking
- Timer e bônus por velocidade
- Medalhas (ouro, prata, bronze)
- Tema claro/escuro

## 📁 Estrutura do Projeto

Lbfg-report/2025-11-04/23-45-54/pro/
├── data/                 # Dados da aplicação
│   ├── incidents.json
│   ├── processes.json
│   ├── requests.json
│   └── users.json
├── src/
│   └── img/
│       └── 12.png
├── js/
│   └── auth.js          # Autenticação
├── views/               # Interfaces por tipo de usuário
│   ├── adm/             # Painel administrativo
│   │   ├── dashboard-adm.html
│   │   ├── tillAdm.html
│   │   ├── lgpd-adm.html
│   │   ├── network.html
│   │   └── logo1.png
│   ├── usuario/         # Painel do usuário
│   │   ├── dashboard-user.html
│   │   ├── faq.html
│   │   ├── tillUsuario.html
│   │   ├── lgpd-user.html
│   │   ├── quiz.html
│   │   ├── support.html
│   │   └── logo1.png
│   ├── login.html       # Página de login
│   └── logo1.png
├── bfg-1.15.0.jar       # Ferramenta BFG
├── bfg.jar
├── main.js              # Processo principal do Electron
├── preload.js           # Script de pré-carga
├── package.json
├── package-lock.json
└── node debug-structure.js

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3 (Grid, Flexbox, Variáveis CSS)
- JavaScript (ES6+)
- Chart.js (Gráficos)
- Canvas Confetti (Efeitos)
- Font Awesome (Ícones)

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/solution-tecnologia.git
