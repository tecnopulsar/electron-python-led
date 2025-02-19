const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false // Asegúrate de que esto esté en false para permitir la comunicación
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

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

// Escuchar el evento para ejecutar Python
ipcMain.on('run-python', (event) => {
  const pythonProcess = spawn('python', ['contador_infinito.py']); // Usar 'python' en Windows

  // Capturar la salida del script de Python
  pythonProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    console.log(`Salida del script: ${output}`);

    // Enviar mensaje al frontend cuando se cumple un minuto
    if (output.includes("Se cumplio")) {
      const minutos = output.match(/\d+/)[0]; // Extraer el número de minutos
      event.reply('minuto-cumplido', minutos); // Enviar el evento al frontend
    }
  });

  // Capturar errores del script de Python
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error en el script: ${data}`);
  });

  // Manejar el cierre del proceso de Python
  pythonProcess.on('close', (code) => {
    console.log(`Proceso de Python cerrado con código ${code}`);
  });
});