let text = document.querySelector('#inputNovaTarefa');
let btnAdd = document.querySelector('#btnAdd');
let listaTarefas = document.querySelector('#listaTarefas');
let janelaEdicao = document.querySelector('#janelaEdicao');
let janelaEdicaoFundo = document.querySelector('#janelaEdicaoFundo');
let janelaEdicaoBtnFechar = document.querySelector('#janelaEdicaoBtnFechar');
let btnAtualizarTarefa = document.querySelector('#btnAtualizarTarefa');
let inputTarefaNomeEdicao = document.querySelector('#inputTarefaNomeEdicao')
let idT = document.querySelector('#idT');
const qtdIdsDisponiveis = 1000;
const KEY_CODE_ENTER = 13;
const KEY_LOCAL_STORAGE = 'listaDeTarefas';
let dbTarefas = [];
obterTarefasLocalStorege(); // Obter os dados do LocalStorege
renderizarListaTarefaHtml(); // Renderizar os dados do localStorage


text.addEventListener('keypress', (e) => {
  if (e.keyCode == KEY_CODE_ENTER) {
    let tarefa = {
      nome: text.value,
      id: gerarIdV2(),
    }
    adcionarTarefa(tarefa)
    //TODO:: Adicionar a tarefa ao HTML
  }
});
janelaEdicaoBtnFechar.addEventListener('click',(e) =>{
  alternarJanelaEdicao();
})

btnAtualizarTarefa.addEventListener('click',(e) =>{
  e.preventDefault();
  let idTarefa = idT.innerHTML.replace('#','');
  let tarefa ={
    nome: inputTarefaNomeEdicao.value,
    id: idTarefa
  }
  let tarefaAtual = document.getElementById(''+idTarefa+'');
  if(tarefaAtual){
    const indiceTarefa = obterIndiceTarefaPorId(idTarefa);
    dbTarefas[indiceTarefa] = tarefa;
    salvarTarefasLocalStore();

    let li = criarTagLi(tarefa);
    listaTarefas.replaceChild(li, tarefaAtual);
    alternarJanelaEdicao();
    
  }else{
    alert("Elemento HTML não encontrado !")
  }

})

btnAdd.addEventListener('click', (e) => {
  let tarefa = {
    nome: text.value,
    id: gerarIdV2(),
  }
  adcionarTarefa(tarefa)
});

function gerarId() {
  return Math.floor(Math.random() * qtdIdsDisponiveis);
}

function gerarIdV2 (){
  return gerarIdUnico();
}
function gerarIdUnico(){
  let itensDaLista = document.querySelector('#listaTarefas').children;
  let idsGerados = [];

  for(let i = 0; i<itensDaLista.length; i++){
    idsGerados.push(itensDaLista[i].id);
  }

  let contadorIds = 0;
  let id = gerarId();
  while(contadorIds <= qtdIdsDisponiveis && idsGerados.indexOf(id.toString()) > -1){
    id = gerarId();
    contadorIds++;
  
  if(contadorIds >= qtdIdsDisponiveis){
    alert("Ops, Ficamos sem IDs !");
    throw new Error("Acabous os Ids !!")
  }
}

  /*let id = gerarId();
  if(idsGerados.indexOf(id.toString()) > -1){
    return gerarIdUnico();
  }
  */
  return id;
}

function adcionarTarefa(tarefa) {
  if(text.value == ''){
    alert("Digite sua tarefa")
  }else{
    dbTarefas.push(tarefa);
    salvarTarefasLocalStore();
    renderizarListaTarefaHtml();
  }
}
function criarTagLi(tarefa) {
  let li = document.createElement('li');
  li.id = tarefa.id;
  let span = document.createElement('span');
  span.classList.add('textoTarefa');
  span.innerHTML = tarefa.nome;

  let div = document.createElement('div');
  let btnEditar = document.createElement('button');
  btnEditar.classList.add('btnAcao')
  btnEditar.innerHTML = ` <i class="fa fa-pencil"></i>`

  btnEditar.setAttribute('onclick', 'editar(' + tarefa.id + ')')

  let btnExcluir = document.createElement('button')
  btnExcluir.classList.add('btnAcao');
  btnExcluir.innerHTML = ` <i class="fa fa-trash"></i>`

  btnExcluir.setAttribute('onclick', 'excluir(' + tarefa.id + ')')

  div.appendChild(btnEditar)
  div.appendChild(btnExcluir)

  li.appendChild(span);
  li.appendChild(div)
 
  return li;
}

function editar(idTarefa) {
  let li = document.getElementById('' + idTarefa+ '');
  if(li){
    idT.innerHTML = `#${idTarefa}`;
    inputTarefaNomeEdicao.value = li.innerText;
    alternarJanelaEdicao()
    
  }else{
    alert("Elemento HTML não encontrado !")
  }
}
function excluir(idTarefa) {
  let confirmacao = window.confirm("Tem certeza que deseja excluir?");
  if (confirmacao) {
    const indiceTarefa = obterIndiceTarefaPorId(idTarefa);
    dbTarefas.splice(indiceTarefa,1);
    salvarTarefasLocalStore();

    let li = document.getElementById(`${idTarefa}`);//# está especificando que funciona como ID;
    if (li) {
      listaTarefas.removeChild(li);
     
    }else{
      alert("Elemento HTML não encontrado !")
    }
  }
}

function alternarJanelaEdicao(){
  janelaEdicao.classList.toggle('abrir');
  janelaEdicaoFundo.classList.toggle('abrir');
}
function obterIndiceTarefaPorId(idTarefa){
  const indiceTarefa = dbTarefas.findIndex(t => t.id == idTarefa);
  if(indiceTarefa < 0){
    throw new Error('Item não encontrado !!!', idTarefa);
  }
  return indiceTarefa;
}

function renderizarListaTarefaHtml(){
  listaTarefas.innerHTML = '';
  for (i = 0; i < dbTarefas.length; i++){
    let li = criarTagLi(dbTarefas[i]);
    listaTarefas.appendChild(li)
   
  }
  text.value = '';
}

function obterTarefasLocalStorege(){
  if(localStorage.getItem(KEY_LOCAL_STORAGE)){
    dbTarefas = JSON.parse(localStorage.getItem(KEY_LOCAL_STORAGE))
  }
}

function salvarTarefasLocalStore (){
  localStorage.setItem(KEY_LOCAL_STORAGE,JSON.stringify(dbTarefas));
}