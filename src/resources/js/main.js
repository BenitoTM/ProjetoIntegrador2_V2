    let qtdCabelo = 0;
    let qtdBarba = 0;
    let qtdSobrancelha = 0;
    let qtdPintura = 0;
    let qtdHidratacao = 0;
    let qtdInfantil=0;

    function oprSomar(btnClick){
        if(btnClick == "qtdCabelo"){
            qtdCabelo++;
            document.getElementById('qtdCabelo').innerHTML = qtdCabelo; //dentro das tags
        }
        else if(btnClick == "qtdBarba"){
            qtdBarba++;
            document.getElementById('qtdBarba').innerHTML = qtdBarba; //dentro das tags
        }
        else if(btnClick == "qtdSobrancelha"){
            qtdSobrancelha++;
            document.getElementById('qtdSobrancelha').innerHTML = qtdSobrancelha; //dentro das tags
        }
        else if(btnClick == "qtdPintura"){
            qtdPintura++;
            document.getElementById('qtdPintura').innerHTML = qtdPintura; //dentro das tags
        }
        else if(btnClick == "qtdHidratacao"){
            qtdHidratacao++;
            document.getElementById('qtdHidratacao').innerHTML = qtdHidratacao; //dentro das tags
        }
        else if(btnClick == "qtdInfantil"){
            qtdInfantil++;
            document.getElementById('qtdInfantil').innerHTML = qtdInfantil; //dentro das tags
        }

    }

    function oprSubtrair(btnClick){
        if(btnClick == "qtdCabelo" && qtdCabelo != 0){
            qtdCabelo--;
            document.getElementById('qtdCabelo').innerHTML = qtdCabelo; //dentro das tags
        }
        else if(btnClick == "qtdBarba" && qtdBarba != 0){
            qtdBarba--;
            document.getElementById('qtdBarba').innerHTML = qtdBarba; //dentro das tags
        }
        else if(btnClick == "qtdSobrancelha" && qtdSobrancelha != 0){
            qtdSobrancelha--;
            document.getElementById('qtdSobrancelha').innerHTML = qtdSobrancelha; //dentro das tags
        }
        else if(btnClick == "qtdPintura" && qtdPintura != 0){
            qtdPintura--;
            document.getElementById('qtdPintura').innerHTML = qtdPintura; //dentro das tags
        }
        else if(btnClick == "qtdHidratacao" && qtdHidratacao != 0){
            qtdHidratacao--;
            document.getElementById('qtdHidratacao').innerHTML = qtdHidratacao; //dentro das tags
        }
        else if(btnClick == "qtdInfantil" && qtdInfantil != 0){
            qtdInfantil--;
            document.getElementById('qtdInfantil').innerHTML = qtdInfantil; //dentro das tags
        }

    }

    