const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

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

            // console.log(card.codigo)

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

async function inclusaoCompraServicos (req, res)
{
    const {qtdCabelo
        ,qtdBarba
        ,qtdSobrancelha
        ,qtdPintura
        ,qtdHidratacao
        ,qtdInfantil
        ,numeroCartao} = req.body

    const servicos = new Servicos (numeroCartao, qtdCabelo, qtdBarba, qtdSobrancelha, qtdPintura, qtdHidratacao, qtdInfantil);

    try
    {
        await global.servicosBD.ValidarCartao(numeroCartao)

        await  global.servicosBD.incluaServicos(servicos);
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
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM `t_codigo` WHERE codigo = ?", [codigoCartao], (err, results) => {
          if (err) {
            console.error('Erro na consulta:', err);
            resolve(false);
          } else {
            console.log(results);
            resolve(true);
          }
        });
      });
}


async function ativacaoDoServidor ()
{
    const dbConfig = require('./dbconfig.js');
    const connection =  await mysql.createConnection(dbConfig);
      
    connection.connect((err) => {
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
