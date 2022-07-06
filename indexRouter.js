const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.connect('mongodb://mongo-1.prd.pravaler.com.br:27017',{dbName:'lachesis-consult'});
const neuroTechConsultSchema = require('./schemas/neuroTechConsult');
const fs = require('fs');
const Neuro = mongoose.model('Neuro', neuroTechConsultSchema);

const fields = [
    'PROP_CPF_ALUNO',
    'PROP_CPF_GARANTIDOR',
    'PROP_RENDA_ALUNO',
    'PROP_RENDA_GARANTIDOR',
    'PROP_IES',
    'PROP_CURSO',
    'PROP_MENSALIDADE',
    'PROP_DATA_NASC_ALUNO',
    'PROP_DATA_NASC_GARANTIDOR',
    'PROP_UF_ALUNO',
    'PROP_GRAU_PARENTESCO',
    'PROP_OCUPACAO_GARANTIDOR',
    'PROP_ESTADO_CIVIL_GARANTIDOR',
    'PROP_BOLETO_ATIVO_ALUNO',
    'PROP_BOLETO_ATIVO_GARANTIDOR',
    'PROP_ALUNO_TITULO_ATIVO',
    'PROP_ALUNO_WO',
    'PROP_MENSALIDADE_ATIVA_IES',
    'PROP_DATA_CONTRATO',
    'PROP_ESCORE_WHRTY_CREDIT',
    'PROP_ANALISE_CREDITO_DECISAO_IA',
    'PROP_PONTO_CORTE',
    'CALC_SCORE_INTERNO',
    'CALC_BVS_SCORE_POSITIVO_ALUNO_SCORE',
    'CALC_BVS_SCORE_POSITIVO_GARANTIDOR_SCORE',
    'CALC_SCORE_FINAL',
    'CALC_SCORE_CP',
    'CALC_BVS_SITUACAO_REGULAR_ALUNO',
    'CALC_BVS_SITUACAO_REGULAR_GARANTIDOR',
    'CALC_ALUNO_IS_PEP',
    'CALC_GARANTIDOR_IS_PEP',
    'CALC_MOTIVO_RESSUBMISSAO',
    'CALC_IDADE_ALUNO',
    'CALC_CHAMADA_FLUXO',
    'CALC_ANTECIPACAO',
    'CALC_GESTAO',
    'CALC_COMPLEMENTAR',
    'CALC_MODALIDADE_IES ',
    'CALC_ANALISE_CREDITO_DECISAO',
    'CALC_MOTIVO_RECUSA',
    'CALC_COFICIENTE_ESTADO',
    'CALC_COEFICIENTE_OCUPACAO',
    'CALC_COEFICIENTE_IDADE',
    'CALC_COEFICIENTE_PARENTESCO',
    'CALC_COEFICIENTE_ESTADO_CIVIL',
    'CALC_ANTECIPACAO',
    'CALC_GESTAO',
    'CALC_COMPLEMENTAR',
    'CALC_REPASSE_GARANTIDO',
    'CALC_GESTAO_GARANTIDO',
]

router.get('/', async function (req, res, next) {
    let query = Neuro.find();
    let line = [];
    let groupLine = [];
    query.exec(function (err, a) {
        if(a.length>0){            
            for(item of a){
                const itemType = typeof item.Response?.Result?.Result;
                const outputType = typeof item.Response?.Result?.Outputs;
                if(itemType !== 'undefined'){
                    if(outputType !== 'undefined'){
                        line['ID'] = item._id;
                        line['RESULTADO'] = item.Response.Result.Result;
                        for(field of fields){
                            for(item2 of item.Response.Result.Outputs){
                                if(item2['Key'] == field){
                                    line[field] = item2['Value'];
                                }
                                if(typeof line[field] == 'undefined'){
                                    line[field] = '';
                                }
                            }
                        }
                        let lineJsonObj = Object.assign({}, line);
                        groupLine.push(lineJsonObj);
                    }
                }                
            }         
            
            if (!fs.existsSync('./exports')) fs.mkdirSync('./exports');

            //Header
            let header = ['ID','RESULTADO'];
            const con = header.concat(fields);
            fs.appendFileSync('./exports/neurotech.csv', con.join(';') + '\r\n', {
                encoding: 'utf-8',
            });
            //Corpo
            groupLine.map((item) => {
                const resultArray = Object.keys(item).map(function (itemIndex) {
                    const lineArray = item[itemIndex];
                    return lineArray;
                });
                fs.appendFileSync('./exports/neurotech.csv', resultArray.join(';') + '\r\n', {
                    encoding: 'utf-8',
                });
            });
        
        }else{
            throw new err;
        }
    });
    res.send('Sendo executado...');
});

module.exports = router;
