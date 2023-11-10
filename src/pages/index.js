const express = require('express');//um framework para gerar api mais facil
const cors = require('cors');//is a mechanism for integrating applications. CORS defines a way for client web applications that are loaded in one domain to interact with resources in a different domain.
const mysql = require('mysql2');//drive do banco

function middleWareGlobal (req, res, next)
{
    console.time('Requisição'); // marca o início da requisição
    console.log('Método: '+req.method+'; URL: '+req.url); // retorna qual o método e url foi chamada

    next(); // função que chama as próximas ações

    console.log('Finalizou'); // será chamado após a requisição ser concluída

    console.timeEnd('Requisição'); // marca o fim da requisição
}


function gerarNumeroAleatorio() {
  const min = 100000; // O menor número de 6 dígitos (inclusivo)
  const max = 999999; // O maior número de 6 dígitos (inclusivo)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/// BANCO DE DADOS 
function CardBD (connection)
{
	this.connection = connection;
	
	this.inclua = async function (card) {
		return new Promise((resolve, reject) => {
            const query = 'INSERT INTO t_codigo (codigo) VALUES (?)';
            const values = [card.codigo];

            console.log(card.codigo)

            connection.query(query, values, (err, results) => {
                if (err) {
                    console.error('Erro ao inserir um novo serviço:', err);
                    reject('Erro ao inserir um novo serviço');
                } else {
                    resolve('Serviço inserido com sucesso');
                }
            });
        })
	}	
	
}

function ServicosBD (connection)
{
	this.connection = connection;
	this.ValidarCartao=async function(codigoCartao)
    {
        return await ValidarCartao(connection, codigoCartao)
    };

	this.incluaServicos = async function (servicos) 
    {
		return new Promise((resolve, reject) => {
            const query = 'INSERT INTO t_compras (numeroCartao, qtdCabelo, qtdBarba, qtdSobrancelha, qtdPintura, qtdHidratacao, qtdCorteInfantil, dataCompra) '+
            'VALUES (?,?,?,?,?,?,?,?)';
            const values = [servicos.numeroCartao, servicos.qtdCabelo, servicos.qtdBarba, servicos.qtdSobrancelha, servicos.qtdPintura, servicos.qtdHidratacao, servicos.qtdCorteInfantil, new Date()];

            connection.query(query, values, (err, results) => {
                if (err) 
                {
                    console.error('Erro ao inserir um novo serviço:', err);
                    reject('Erro ao inserir um novo serviço');
                } else 
                {
                    resolve('Serviço inserido com sucesso');
                }
            });
        })
	}	
	
}


// CLASSE 
function Card (codigo) {
    this.codigo = codigo;
}

function Servicos (numeroCartao, qtdCabelo, qtdBarba, qtdSobrancelha, qtdPintura, qtdHidratacao, qtdCorteInfantil) 
{
    this.numeroCartao = numeroCartao;
    this.qtdCabelo = qtdCabelo;
    this.qtdBarba = qtdBarba;
    this.qtdSobrancelha = qtdSobrancelha;
    this.qtdPintura = qtdPintura;
    this.qtdHidratacao = qtdHidratacao;
    this.qtdCorteInfantil = qtdCorteInfantil;
}

function Comunicado (codigo,mensagem,descricao)
{
	this.codigo    = codigo;
	this.mensagem  = mensagem;
	this.descricao = descricao;
}



// FUNCOES JS
async function inclusao (req, res){
    const codigo = gerarNumeroAleatorio()
    const card = new Card (codigo);

    try
    {
        await  global.cardBD.inclua(card);
        const  sucesso = new Comunicado ('IBS','Inclusão bem sucedida', codigo);
        return res.status(201).json(sucesso);
	}
	catch (erro)
	{
		const  erro2 = new Comunicado ('LJE','Card ja existente',
		                  'Já há um cartão cadastrado com o código informado');
        return res.status(409).json(erro2);
    }
}

const validaCartao = servicosBD.ValidarCartao(numeroCartao);

async function inclusaoCompraServicos (req, res)
{
    const {qtdCabelo
        ,qtdBarba
        ,qtdSobrancelha
        ,qtdPintura
        ,qtdHidratacao
        ,qtdInfantil
        ,numeroCartao} = req.body //desetruturação de objeto para passar as informações ao banco

    const servicos = new Servicos (numeroCartao, qtdCabelo, qtdBarba, qtdSobrancelha, qtdPintura, qtdHidratacao, qtdInfantil);

    try
    {
        await this.validaCartao(numeroCartao)
        // await this.servicosBD.ValidarCartao(numeroCartao)

        await  this.servicosBD.incluaServicos(servicos);
        const  sucesso = new Comunicado ('IBS','Inclusão bem sucedida');
        return res.status(201).json(sucesso);
	}
	catch (erro)
	{
		const  erro2 = new Comunicado ('LJE','Erro na compra de serviços');
        return res.status(409).json(erro2);
    }
}

async function ValidarCartao(connection, codigoCartao)
{
    // return new Promise((resolve, reject) => { //Promisse é uma classe no JS que descreve as funções; Onde pode ser executada no ato ou em outro momento especificado
    //     connection.query("SELECT * FROM `t_codigo` WHERE codigo = ?", [codigoCartao], (err, results) => {
    //       if (err) {
    //         console.error('Erro na consulta:', err);
    //         resolve(false); // Resolve a Promise com false em caso de erro
    //       } else {
    //         // Processar os resultados aqui, se necessário
    //         console.log(results);
    //         resolve(true); // Resolve a Promise com true se a consulta for bem-sucedida
    //       }
    //     });
    //   });

    const func = new Promise((resolve) => { //Promisse é uma classe no JS que descreve as funções; Onde pode ser executada no ato ou em outro momento especificado
        
        connection.query(
            "SELECT ? FROM `t_codigo` WHERE codigo = ?", //A "?" esta sendo usada pra evitar SQLInjection
            ['*',codigoCartao], 
            (err, results) => {
                if (err) {
                console.error('Erro na consulta:', err);
                resolve(false); // Resolve a Promise com false em caso de erro  || resolve é uma função que executa a promisse
                } else {
                // Processar os resultados aqui, se necessário
                console.log(results);
                resolve(true); // Resolve a Promise com true se a consulta for bem-sucedida
            }
        });
    });

    await Promise.all([func]) //linha para falar pro JS executar o promisse agora
}


async function ativacaoDoServidor ()
{
    const dbConfig = require('./dbconfig.js'); //setar os parametros do banco
    const connection =  await mysql.createConnection(dbConfig); //Cria config para conexão no banco com os dados fornecidos na linha 171
      
    connection.connect((err) => { //chamando função de conectar  || err é uma callback em caso de erro na conexão com o banco
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
            process.exit(1);
        } 
    });

    console.log('Conectado ao banco de dados MySQL');
    const app     = express();

    app.use(express.json());  
	app.use(cors()) 
    app.use(middleWareGlobal);

    const cardBd = new CardBD(connection)
    global.cardBD = cardBd

    const servicosBd = new ServicosBD(connection)
    global.servicosBD = servicosBd

    app.post  ('/card', inclusao);
    app.post  ('/services', inclusaoCompraServicos);

    console.log ('Servidor ativo na porta 3000...');
    app.listen(3000);
}

ativacaoDoServidor();
