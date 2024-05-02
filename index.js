const { app, BrowserWindow, ipcMain } = require('electron')
const memoryjs = require('memoryjs')

const processName = 'csgo.exe'

const processes = memoryjs.getProcesses() // 프로세스 목록
const process = processes.filter(p => p.szExeFile === processName)[0] // processName의 프로세스 찾기
const handle = memoryjs.openProcess(process.th32ProcessID) // 프로세스 열어서 핸들 가져오기

if (!handle) {
    console.error('Failed to open process') // 프로세스 찾지 못함
    process.exit(1)
}

ipcMain.on('read-memory', (event, address, dataType) => { // 렌더러 프로세스에서 메인 프로세스로 메모리 읽기 요청
    const value = memoryjs.readMemory(handle, address, dataType) // 메모리 읽기
    event.returnValue = value // 값을 반환
})

ipcMain.on('write-memory', (event, address, dataType, value) => { // 렌더러 프로세스에서 메인 프로세스로 메모리 쓰기 요청
    memoryjs.writeMemory(handle, address, value, dataType) // 메모리 쓰기
    event.returnValue = null // 반환값 없음
})

ipcMain.on('read-array', (event, address, length) => { // 렌더러 프로세스에서 메인 프로세스로 배열 읽기 요청
    const values = memoryjs.readBuffer(handle, address, length) // 버퍼 읽기
    event.returnValue = values // 값을 반환
})

ipcMain.on('write-array', (event, address, values) => { // 렌더러 프로세스에서 메인 프로세스로 배열 쓰기 요청
    memoryjs.writeBuffer(handle, address, values) // 버퍼 쓰기
    event.returnValue = null // 반환값 없음
})

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600, // 창 크기
    webPreferences: {
      nodeIntegration: true // node.js 사용
    },
    icon: 'icon.png', // 아이콘
    focusable: true, // 마우스 포커스 가능
    title: 'Electron', // 타이틀
    frame: true, // 프레임
    resizable: true, // 크기 조절 가능
    movable: true, // 이동 가능
    minimizable: true, // 최소화 가능
    maximizable: true, // 최대화 가능
    closable: true, // 닫기 가능
    alwaysOnTop: false, // 항상 위에 표시
    fullscreen: false, // 전체화면
    fullscreenable: true, // 전체화면 가능
    transparent: false, // 배경 투명
    hasShadow: true, // 그림자
    darkTheme: false, // 다크 테마
    thickFrame: true, // 두꺼운 프레임
    autoHideMenuBar: true, // 메뉴바 자동 숨김
    webSecurity: true, // 웹 보안
  })

  win.loadFile('index.html') // 로드할 파일
}

app.whenReady().then(() => {
  createWindow() // 창 생성

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  const loop = () => {
    // fps 루프
    requestAnimationFrame(loop)
  }
  loop()
})