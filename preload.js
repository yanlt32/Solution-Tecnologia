const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Métodos de autenticação
  login: (credentials) => ipcRenderer.invoke('login', credentials),
  logout: () => ipcRenderer.invoke('logout'),
  getUser: () => ipcRenderer.invoke('get-user'),

  // Métodos para gerenciamento de dados
  getIncidents: () => ipcRenderer.invoke('get-incidents'),
  getProcesses: () => ipcRenderer.invoke('get-processes'),
  getRequests: () => ipcRenderer.invoke('get-requests'),
  createIncident: (data) => ipcRenderer.invoke('create-incident', data),
  createProcess: (data) => ipcRenderer.invoke('create-process', data),
  createRequest: (data) => ipcRenderer.invoke('create-request', data),
  updateIncident: (id, updates) => ipcRenderer.invoke('update-incident', id, updates),
  deleteIncident: (id) => ipcRenderer.invoke('delete-incident', id),

  // Informações do sistema (opcional)
  platform: process.platform,
  versions: process.versions
});