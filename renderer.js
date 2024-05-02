const {ipcRenderer} = require('electron');

const readMemory = (address, dataType) => {
    return ipcRenderer.sendSync('read-memory', address, dataType);
}

const writeMemory = (address, dataType, value) => {
    return ipcRenderer.sendSync('write-memory', address, dataType, value);
}

const readArray = (address, dataType, length) => {
    return ipcRenderer.sendSync('read-array', address, dataType, length);
}

const writeArray = (address, dataType, values) => {
    return ipcRenderer.sendSync('write-array', address, dataType, values);
}

const address = document.getElementById('address'); // input 요소
const value = document.getElementById('value'); // input 요소
const dataType = document.getElementById('data-type'); // select 요소
const readButton = document.getElementById('read'); // button 요소
const writeButton = document.getElementById('write'); // button 요소

readButton.addEventListener('click', () => {
    const result = readMemory(address.value, dataType.value); // 메모리 읽기
    value.value = result; // 결과 표시
});

writeButton.addEventListener('click', () => {
    writeMemory(address.value, dataType.value, value.value); // 메모리 쓰기
});