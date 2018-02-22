$("document").ready(function () {

    var _queryUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151'; //calling first 151 pokemon
    var _abilityUrl = 'https://pokeapi.co/api/v2/ability/1'
    var _pokemonArray;
    var _abilityArray;

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
                var pokemonHPLabel = '<h5 id=hp' + response.id + ' class=power-label>HP: </h5>';
                var pokeImage = '<img src=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemonID + '.png class="poke-image">';

                $('#' + response.name).parent().append(pokePowerLabel); //adding powerlabel to pokeCard via id
                $('#' + response.name).parent().append(pokemonHPLabel); //adding powerlabel to pokeCard via id
                $('#' + response.name).parent().append(pokeImage);   //appending image 

                $('#pokePower' + response.id).append(pokePower);
                $('#hp' + response.id).append(pokemonHP);

            });
    }

    function appendPokemonToPage(_pokemonArray) {

        for (var i = 0; i < 9; i++) {
            var pokeCard = '<div id=pokeCard' + i + '></div>';
            var pokeContent = '<div class=pokeContent' + i + '></div>';
            var pokeNameContent = 'div id=name' + i + '></div>';
            var nameHeader = '<h5 class="name"> Name: </h5>';
            var currentNo = randomNumber(_pokemonArray.length - 1)
            var currentPokemon = _pokemonArray.splice(currentNo, 1)[0];
            var pokeName = '<span id=' + currentPokemon.name + ' class="poke-name">' + currentPokemon.name + '</span>';

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
            if ($(this).hasClass("alive")) {
                $(this).css("background-color", "lightgreen")
                // console.log("alive is active");
            }
            else {
                $(this).css("background-color", "white").css("border", "1px solid black");
            }
        })

        $(".pokeCard").click(highlighter);

        var pokeCounter = 0;
        function highlighter() {
            pokeCounter++;
            if (pokeCounter <= 3) {
                if ($(this).hasClass("alive")) {
                    $(this).removeClass("alive");
                } else {
                    pokeCounter -= 3;
                    $(this).css("background-color", "green").addClass("alive");
                }

                // console.log("click", this);
            }
        }

        var trainerPokemon = 0;
        $('.pokeCard').click(function () {

            console.log('inside click function');
            trainerPokemon++

            if (trainerPokemon <= 3) {
                console.log('inside trainerPokemon <= 3');
                $('#Ash').append($(this));

            }

            else if (trainerPokemon > 6) {
                console.log('inside trainerPokemon > 6');
                $('#Brock').append($(this));
            }

            else if (trainerPokemon <= 9) {
                console.log('inside trainerPokemon <= 9');
                $("#Misty").append($(this));
            }

            if (trainerPokemon >= 9) {
                console.log('inside trainerPokemon >= 9');
                $('.pokeCard').off('click');
            }
        });
    }
});