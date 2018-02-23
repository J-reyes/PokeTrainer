$("document").ready(function () {

    var _queryUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151'; //calling first 151 pokemon
    var _abilityUrl = 'https://pokeapi.co/api/v2/ability/1'
    var _pokemonArray;
       
    var _pokeDict = {};     //object of objects that is built when pokemon info is pulled from api

    var player0;    //placeholder for active battling pokemon
    var opponentPokemon;    //placeholder for opponent's active battle pokemon
    var opponent2Pokemon; //placeholder for opponent's active battle pokemon


    //random number generator
    function randomNumber(max) {
        return Math.floor(Math.random() * max);

    }

    $.ajax({
        url: _queryUrl,
        method: 'GET'

    })

        .done(function (response) {
            // console.log(response);

            _pokemonArray = response.results    // response.results are the 151 pokemon objects
            // console.log(_pokemonArray[randomNumber151()]);

            appendPokemonToPage(_pokemonArray);
            // console.log(_pokemonArray);
        });


    var pokemonDetail = function (url) {
        $.ajax({
            url: url,
            method: "GET"
        })
            .done(function (response) {
                // console.log(response);
                // console.log(response.id);
                // console.log(response.base_experience);
                // console.log(response.weight)
                var pokePower = Math.floor((2 * response.base_experience + response.weight) / response.height)
                // console.log(pokePower);
                var pokemonHP = pokePower * 3;
                // console.log(response.name, pokemonHP);
                var pokemonID = response.id;    // id used for calling picture

                var pokePowerLabel = '<h5 id=pokePower' + response.id + ' class=power-label>Power: </h5>';
                var pokemonHPLabel = '<h5 id=hp' + response.id + ' class=hp-label>HP: </h5>';

                //pokemon image placeholder
                var pokeImage = '<img src=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemonID + '.png class="poke-image">';

                _pokeDict[response.name].id = response.id;
                _pokeDict[response.name].power = pokePower;
                _pokeDict[response.name].hp = pokemonHP;
                // console.log(_pokeDict);



                $('#' + response.name).parent().append(pokePowerLabel); //adding powerlabel to pokeCard via id
                $('#' + response.name).parent().append(pokemonHPLabel); //adding powerlabel to pokeCard via id
                $('#' + response.name).parent().append(pokeImage);   //appending image 

                $('#pokePower' + response.id).append(pokePower);
                $('#hp' + response.id).append(pokemonHP);

            });
    }



    function appendPokemonToPage(_pokemonArray) {

        for (var i = 0; i < 9; i++) {

            var currentNo = randomNumber(_pokemonArray.length - 1)
            var currentPokemon = _pokemonArray.splice(currentNo, 1)[0];

            var pokeCard = '<div id=pokeCard' + i + ' data-id="' + currentPokemon.name + '"></div>';
            var pokeContent = '<div class=pokeContent' + i + '></div>';

            var pokeNameContent = 'div id=name' + i + '></div>';
            var nameHeader = '<h5 class="name"> Name: </h5>';

            


            var pokeName = '<span id=' + currentPokemon.name + ' class="poke-name">' + currentPokemon.name + '</span>';

            _pokeDict[currentPokemon.name] = {name: currentPokemon.name};
            // console.log(_pokeDict);

            $('.pokemonPicker').append(pokeCard);
            $('#pokeCard' + i).append(pokeContent);
            // $('#pokeCard' + i).append(pokeImage);

            $('.pokeContent' + i).append(nameHeader);
            $('.pokeContent' + i).append(pokeName);

            $('.pokeContent' + i).addClass('poke-content');
            $('#pokeCard' + i).addClass('pokeCard').addClass('col-md-3');

            pokemonDetail(currentPokemon.url);

        };

        // hovering style over pokeCards
        $('.pokeCard').mouseenter(
            function () {
                var $this = $(this);
                $this.data('bgcolor', $this.css('background-color', '#EE7785'));
            }
        );

        $(".pokeCard").mouseleave(function () {

            $(this).css("background-color", "white");
        }
        )


        // Pokemon selection function ////////
        $('.pokeCard').click(function () {

            // console.log('inside click function');      


            $(this).addClass('alive');


            if ($('#mySelection').children().length < 3) {
                // console.log('inside trainerPokemon <= 3');
                $('#mySelection').append($(this));


            }

            else if ($('#opponent1').children().length < 3) {
                // console.log('inside trainerPokemon > 6');
                $('#opponent1').append($(this));

            }

            else if ($('#opponent2').children().length < 3) {
                // console.log('inside trainerPokemon <= 9');
                $("#opponent2").append($(this));

            }

            else if ($('#pokedex').children().length < 1) {
                // console.log('inside trainerPokemon >= 9');
                $('.pokeCard').off('click');


            }

            fightButtonOn();

        })

        //battleButtonOn();

        // setBattleReadyPokemon();
    };



    /////// fightBtn to attackBtn function ///////
    function fightButtonOn() {
        if ($('#pokedex').children().length > 0) {
            $('#opponent1AttackBtn').off('click');
            // console.log('line191')
        }
        else {
            $('#opponent1AttackBtn').click(function () {
                alert("Start PokeBattle! Select 1 pokemon from your roster and 1 pokemon from your opponent");
                // console.log('fightBtnOn');
                $('#mySelection').children().addClass('battleReady');
                $('#opponent1').children().addClass('battleReady');

                battleReadyNow();
                
                battleBtnAppend();
                
                
            });

        }
    }
    
    //// append battleBtn function //////
    function battleBtnAppend() {
        $('#opponent1AttackBtn').remove();
        
        var newAttackBtn = $('<button id=atackBtn1 type=button class=btn-warning>Attack</button>');
        newAttackBtn.click(pokemonAttack);
        
        $('#opponent1h2').append(newAttackBtn);
        $('.btn-warning').addClass('btn');
        
    }


    function battleBtnAppend2() {
        $('#opponent2AttackBtn').remove();
        
        var newAttackBtn = $('<button id=atackBtn1 type=button class=btn-warning>Attack</button>');
        newAttackBtn.click(pokemonAttack2);
        
        $('#opponent2h2').append(newAttackBtn);
        $('.btn-warning').addClass('btn');

        $('#opponent2').children().addClass('battleReady');

    }

 
    //// adding battleActive click event to select pokemon //////
    function battleReadyNow() {

        $('#mySelection > .battleReady').click(addBattleActive);
        $('#opponent1 > .battleReady').click(addBattleActiveOpponent);
    };
    function battleReadyNow2() {

        $('#mySelection > .battleReady').click(addBattleActive);
        $('#opponent2 > .battleReady').click(addBattleActiveOpponent2);
    };

    ///// adding battleActive class to select pokemon //////
    function addBattleActive() {
        $(this).addClass('battleActive');

        player0 = $(this).attr('data-id');
        // console.log(player0);
        
        $('#mySelection > .battleReady').off('click');
        $('#opponent1 > .battleReady').click(addBattleActiveOpponent);
        $('#opponent1 > .battleReady').click(addBattleActiveOpponent2);

        // console.log('battleActive has fired');
    }

    function addBattleActiveOpponent() {
        // console.log('battleactiveopp')
        $(this).addClass('battleActive');

        opponentPokemon = $(this).attr('data-id');
        // console.log(opponentPokemon);

        $('#opponent1 > .battleReady').off('click');
        $('#mySelection > .battleReady').click(addBattleActive);

        // console.log('battleActive has fired');
    }

    function addBattleActiveOpponent2() {
        // console.log('battleactiveopp')
        $(this).addClass('battleActive');

        opponent2Pokemon = $(this).attr('data-id');
        // console.log(opponentPokemon);

        $('#opponent1 > .battleReady').off('click');
        $('#mySelection > .battleReady').click(addBattleActive);

        // console.log('battleActive has fired');
    }



/////// pokebattle function against opponent1 /////////
function pokemonAttack() {
 
    while (_pokeDict[player0].hp > 0 && _pokeDict[opponentPokemon].hp > 0) {            /// pokemon attack each other in turn
        _pokeDict[opponentPokemon].hp -= _pokeDict[player0].power;
        _pokeDict[player0].hp -= _pokeDict[opponentPokemon].power;
        // console.log(_pokeDict);
    
        // opponent1Remove();

        if (_pokeDict[player0].hp > 0 && _pokeDict[opponentPokemon].hp < 1) {
            $('#mySelection > .battleActive > .poke-content > .hp-label').remove();
            
            var newHP = ('<h5 class=hp-label>HP: ' + _pokeDict[player0].hp + '</h5>');
            $(newHP).insertBefore($('#mySelection > .battleActive > .poke-content > img'));
            
            $('#opponent1 > .battleActive').remove();

            alert(_pokeDict[player0].name + ' defeated ' + _pokeDict[opponentPokemon].name + '!');
            
            $('#mySelection > .battleActive').removeClass('battleActive');
            // console.log($('#mySelection').children());
         
            }
    
        else if (_pokeDict[player0].hp < 1 && _pokeDict[opponentPokemon].hp > 0) {
            $('#opponent1 > .battleActive > .poke-content > .hp-label').remove();
            
            var newHP = ('<h5 class=hp-label>HP: ' + _pokeDict[opponentPokemon].hp + '</h5>');
            $(newHP).insertBefore($('#opponent1 > .battleActive > .poke-content > img'));
           
            $('#mySelection > .battleActive').remove();

            alert(_pokeDict[opponentPokemon].name + ' defeated ' + _pokeDict[player0].name + '!');
            
            $('#opponent1 > .battleActive').removeClass('battleActive');
            // console.log("opponentPokemon HP should update");
         
            }

        opponent1Remove();

        battleReadyNow2();  

        
    }
}

/////// pokebattle function against opponent2 /////////

function pokemonAttack2() {
 
    while (_pokeDict[player0].hp > 0 && _pokeDict[opponent2Pokemon].hp > 0) {
        _pokeDict[opponent2Pokemon].hp -= _pokeDict[player0].power;
        _pokeDict[player0].hp -= _pokeDict[opponent2Pokemon].power;
        // console.log(_pokeDict);
    
        // opponent1Remove();

        if (_pokeDict[player0].hp > 0 && _pokeDict[opponent2Pokemon].hp < 1) {
            $('#mySelection > .battleActive > .poke-content > .hp-label').remove();
            
            var newHP = ('<h5 class=hp-label>HP: ' + _pokeDict[player0].hp + '</h5>');
            $(newHP).insertBefore($('#mySelection > .battleActive > .poke-content > img'));
            
            $('#opponent2 > .battleActive').remove();

            alert(_pokeDict[player0].name + ' defeated ' + _pokeDict[opponent2Pokemon].name + '!');
            
            $('#mySelection > .battleActive').removeClass('battleActive');
            // console.log($('#mySelection').children());
         
            }
    
        else if (_pokeDict[player0].hp < 1 && _pokeDict[opponent2Pokemon].hp > 0) {
            $('#opponent2 > .battleActive > .poke-content > .hp-label').remove();
            
            var newHP = ('<h5 class=hp-label>HP: ' + _pokeDict[opponent2Pokemon].hp + '</h5>');
            $(newHP).insertBefore($('#opponent2 > .battleActive > .poke-content > img'));
           
            $('#mySelection > .battleActive').remove();

            alert(_pokeDict[opponent2Pokemon].name + ' defeated ' + _pokeDict[player0].name + '!');
            
            $('#opponent2 > .battleActive').removeClass('battleActive');
            // console.log("opponent2Pokemon HP should update");
         
            }

        opponent2Remove();
        
    }
}

////// removing opponent1 after defeat ////////////    
   
function opponent1Remove() {
    // console.log( $("#opponent1").children().length );
    if ($('#opponent1').children().length < 1) {
        $('#opponent1h2').remove();
        alert('Opponent 1 defeated! Opponent 2 is waiting!')
        // console.log('removing opponent1 has run');
        battleBtnAppend2();
    } else if ($('#mySelection').children().length < 1 && $('#opponent1').children().length > 0) {
        alert('You have been defeated. You are not a PokeMaster');
    }
}

////// removing opponent2 after defeat ////////////    

function opponent2Remove() {
    // console.log( $("#opponent1").children().length );
    if ($('#opponent2').children().length < 1) {
        $('#opponent2h2').remove();
        alert('Opponent 2 defeated! You are a PokeMaster!!')
        // console.log('removing opponent2 has run');
    } else if ($('#mySelection').children().length < 1 && $('#opponent2').children().length > 0) {
        alert('You have been defeated. You are not a PokeMaster.');
    }
}



















});