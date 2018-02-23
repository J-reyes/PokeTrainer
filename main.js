$("document").ready(function () {

    var _queryUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151'; //calling first 151 pokemon
    var _abilityUrl = 'https://pokeapi.co/api/v2/ability/1'
    var _pokemonArray;
    var _abilityArray;
    var _pokeDict = {};

    var player0;
    var opponentPokemon;

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




        var trainerPokemon = [];
        var opponent1Pokemon = [];
        var opponent2Pokemon = [];
        var allPokemonCounter = [];
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

    function battleBtnAppend() {
        $('#opponent1AttackBtn').remove();
        
        var newAttackBtn = $('<button id=atackBtn1 type=button class= btn btn-warning>Attack</button>');
        newAttackBtn.click(pokemonAttack);
        $('#opponent1h2').append(newAttackBtn);
    }

 


    


    // function setBattleReadyPokemon() {
    //     var mySelectedChildren = $('#mySelection').children();
    //     var opponent1Children =$('#opponent1').children();
    //     var counter = 0;

    //     while (counter < 2) {

    //         for (var i = 0; i < $('#mySelection').children().length; i++) {

    //             if (mySelectedChildren[i].outerHTML.includes("battleActive") == false) {
    //                 battleReadyNow();
    //                 counter++;
    //                 console.log(mySelectedChildren[i].outerHTML.includes("battleActive") )
    //             }
    //             else {
    //                 battleReadyOff();
    //                 counter--;
    //                 console.log('244', mySelectedChildren[i].outerHTML.includes("battleActive") )
    //             }
    //         }

    //     }

    // }

    // setBattleReadyPokemon();

    function battleReadyNow() {

        $('#mySelection > .battleReady').click(addBattleActive);
        $('#opponent1 > .battleReady').click(addBattleActiveOpponent);
    };

    function addBattleActive() {
        $(this).addClass('battleActive');

        player0 = $(this).attr('data-id');
        // console.log(player0);
        
        $('#mySelection > .battleReady').off('click');
        $('#opponent1 > .battleReady').click(addBattleActiveOpponent);

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

// function PokeBattle() {
//     myActivePokemon = $('#mySelection > .battleActive')
//     opponent1ActivePokemon = $('#opponent1 > .battleActive')

//     // if (player0)
//     // console.log(myActivePokemon.attr('id'));
//     // console.log(opponent1ActivePokemon.attr('id'));
// }

function pokemonAttack() {
    // myActivePokemon = $('#mySelection > .battleActive')
    // opponent1ActivePokemon = $('#opponent1 > .battleActive')
    
    // var myNewHP;
    // var opNewHP;

    // myNewHP = _pokeDict[player0].hp - _pokeDict[opponentPokemon].power;
    // console.log(myNewHP);

    while (_pokeDict[player0].hp > 0 && _pokeDict[opponentPokemon].hp > 0) {
        _pokeDict[opponentPokemon].hp -= _pokeDict[player0].power;
        _pokeDict[player0].hp -= _pokeDict[opponentPokemon].power;
        // console.log(_pokeDict);
    
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

        // $('.battleActive').removeClass('battleActive');

        if ($('#mySelection').children > 1 && $('#opponent1').children < 2) {
            $('#opponent1h2').remove();
            console.log('removing opponent1 has run');
        } else {
            console.log('did not remove opponent1');
        }
    }

    
    //if ()
}











});