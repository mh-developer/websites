let listItems    = {};
let listOfItems  = [];
let count        = 0;
let isEdit       = false;
let slikaIzdelka = "https://via.placeholder.com/350x250";
let editOf;

function findMax() {
    $.each(listItems, function (key, value) {
        if (key > count) {
            count = key;
        }
    });
}

function znamkaValidacija() {
    const znamka = $("#znamka-input").val();
    let isValid = true;

    if(znamka.length === 0) {
        $("#znamka-input").removeClass("border-success");
        $("#znamka-input").addClass("border-error");
        $(".form-znamka .error").show();

        isValid = false;
    }
    else{
        $("#znamka-input").removeClass("border-error");
        $("#znamka-input").addClass("border-success");
        $(".form-znamka .error").hide();
    }
    return isValid;
}

function nazivValidacija() {
    const naziv  = $("#naziv-input").val();
    let isValid = true;

    if(naziv.length === 0) {
        $("#naziv-input").removeClass("border-success");
        $("#naziv-input").addClass("border-error");
        $(".form-naziv .error").show();

        isValid = false;
    }
    else{
        $("#naziv-input").removeClass("border-error");
        $("#naziv-input").addClass("border-success");
        $(".form-naziv .error").hide();
    }
    return isValid;
}

function zalogaValidacija() {
    const zaloga = $("#zaloga-input").val();
    let isValid = true;

    if(zaloga.length === 0) {
        $("#zaloga-input").removeClass("border-success");
        $("#zaloga-input").addClass("border-error");
        $(".form-zaloga .error").show();

        isValid = false;
    }
    else{
        $("#zaloga-input").removeClass("border-error");
        $("#zaloga-input").addClass("border-success");
        $(".form-zaloga .error").hide();
    }
    return isValid;
}

function cenaValidacija() {
    const cena   = $("#cena-input").val();
    let isValid = true;

    if(cena.length === 0 || isNaN(Number(cena))) {
        $("#cena-input").removeClass("border-success");
        $("#cena-input").addClass("border-error");
        $(".form-cena .error").show();

        if(isNaN(Number(cena))) {
            $(".form-cena .error").text("Vnešena vrednost ni veljavna (veljavne vrednosti npr. 12.5 ali 12)")
        }
        else {
            $(".form-cena .error").text("To polje je obvezno")
        }

        isValid = false;
    }
    else{
        $("#cena-input").removeClass("border-error");
        $("#cena-input").addClass("border-success");
        $(".form-cena .error").hide();
    }
    return isValid;
}

function opisValidacija() {
    const opis   = $("#opis-izdelka-input").val();
    let isValid = true;

    if(opis.length < 25 || opis.length > 300) {
        $("#opis-izdelka-input").removeClass("border-success");
        $("#opis-izdelka-input").addClass("border-error");
        $(".form-opis .error").show();

        isValid = false;
    }
    else{
        $("#opis-izdelka-input").removeClass("border-error");
        $("#opis-izdelka-input").addClass("border-success");
        $(".form-opis .error").hide();
    }
    return isValid;
}

function validacija() {
    const znamka = znamkaValidacija();
    const naziv  = nazivValidacija();
    const zaloga = zalogaValidacija();
    const cena   = cenaValidacija();
    const opis   = opisValidacija();

    return znamka && naziv && zaloga && cena && opis;
}

function addNewItem() {

    if (validacija() && !isEdit) {
        findMax();
        const id     = ++count;
        const znamka = $("#znamka-input"      ).val();
        const naziv  = $("#naziv-input"       ).val();
        const zaloga = $("#zaloga-input"      ).val();
        const cena   = $("#cena-input"        ).val();
        const opis   = $("#opis-izdelka-input").val();
        const slika  = slikaIzdelka;

        const Izdelek = {
            identify: id,
              znamka: znamka,
               naziv: naziv,
              zaloga: zaloga,
                cena: cena,
                opis: opis,
               slika: slika
        }

        listItems[count] = Izdelek;
        refreshItems()

        $("#input-form").hide();
        $("input, select, textarea").removeClass("border-error");
        $("input, select, textarea").removeClass("border-success");
        $("input, select, textarea").val("");
        $(".error").hide();
        slikaIzdelka = "https://via.placeholder.com/350x250";
    }

    if(validacija() && isEdit) {
        const id     = editOf;
        const znamka = $("#znamka-input"      ).val();
        const naziv  = $("#naziv-input"       ).val();
        const zaloga = $("#zaloga-input"      ).val();
        const cena   = $("#cena-input"        ).val();
        const opis   = $("#opis-izdelka-input").val();
        const slika  = slikaIzdelka;

        listItems[id].znamka = znamka;
        listItems[id].naziv = naziv;
        listItems[id].zaloga = zaloga;
        listItems[id].cena = cena;
        listItems[id].opis = opis;
        listItems[id].slika = slika !== "https://via.placeholder.com/350x250" ? slika : listItems[id].slika;


        refreshItems()

        $("#input-form").hide();
        $("input, select, textarea").removeClass("border-error");
        $("input, select, textarea").removeClass("border-success");
        $("input, select, textarea").val("");
        $(".error").hide();
        slikaIzdelka = "https://via.placeholder.com/350x250";
        isEdit = false;
        editOf = null;
    }
}

function refreshItems() {
    $(".izdelki-grid").empty();
    localStorage.clear()
    $.each(listItems, function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        loadIzdelek(value.identify, value.znamka, value.naziv, value.zaloga, value.cena, value.opis, value.slika);
    });
}

function najcenejsi() {
    $(".izdelki-grid").empty();
    toArray();
    $.each(listOfItems.sort((val1, val2) => { return val1.cena - val2.cena; }), function (key, value) {
        loadIzdelek(value.identify, value.znamka, value.naziv, value.zaloga, value.cena, value.opis, value.slika);
    });
}

function najdrazji() {
    $(".izdelki-grid").empty();
    toArray();
    $.each(listOfItems.sort((val1, val2) => { return val2.cena - val1.cena; }), function (key, value) {
        loadIzdelek(value.identify, value.znamka, value.naziv, value.zaloga, value.cena, value.opis, value.slika);
    });
}

function toArray() {
    listOfItems = [];
    $.each(listItems, (key, value) => {
        listOfItems.push(value);
    });
}

function convertImgToBase64() {
    let file = $('#uploadIzdelek').get(0).files;

    let reader = new FileReader();
    reader.addEventListener("load", () => {
        slikaIzdelka = reader.result;
    });

    if (file.length > 0) {
        reader.readAsDataURL(file[0]);
    }
}

function deleteItem(item) {
    const idOfItem = item.id.split("-");
    const indexOfItem = idOfItem[idOfItem.length - 1];
    delete listItems[indexOfItem];
    localStorage.removeItem(indexOfItem);
    $(`#item-${indexOfItem}`).remove();
}

function editItem(item) {
    const idOfItem = item.id.split("-");
    const indexOfItem = idOfItem[idOfItem.length - 1];
    const getItem = listItems[indexOfItem];
    editOf = indexOfItem;
    
    $("#znamka-input"      ).val(getItem.znamka);
    $("#naziv-input"       ).val(getItem.naziv );
    $("#zaloga-input"      ).val(getItem.zaloga);
    $("#cena-input"        ).val(getItem.cena  );
    $("#opis-izdelka-input").val(getItem.opis  );

    $("#input-form").show();
    $("input, select, textarea").removeClass("border-error");
    $("input, select, textarea").removeClass("border-success");
    $(".error").hide();
    isEdit = true;
}

function loadIzdelek(id, znamka, naziv, zaloga, cena, opis, slika) {
    $(".izdelki-grid").append(
        `
        <div class="item" id="item-${id}">
            <div class="manage-item">
                <button class="btn add-izdelek" id="brisanje-produkta-${id}" onclick="deleteItem(this)">&#9747;</button>
                <button class="btn add-izdelek" id="urejanje-produkta-${id}" onclick="editItem(this)">&#9998;</button>
            </div>
            <div>
                <img class="responsive-img" src="${slika}" alt="Javascript">
            </div>
            <div class="opis">
                <h2>${znamka} ${naziv}</h2>
                <hr>
                <div class="vrednost-izdelka">
                    <span class="zaloga ${zaloga == "Na zalogi" ? "green" : zaloga == "V skladišču" ? "warning" : "red"}">${zaloga == "" ? "Ni na zalogi" : zaloga}</span>
                    <span class="cena">${cena} €</span>
                </div>
                <p>
                    ${opis}
                </p>
            </div>
        </div>
        `
    );
}

function loadLocalStorage() {
    for ( var i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let parse = JSON.parse(localStorage.getItem(key));
        listItems[key] = parse;
        loadIzdelek(parse.identify, parse.znamka, parse.naziv, parse.zaloga, parse.cena, parse.opis, parse.slika);
    }
}


function search() {
    let searchValue = String($("#input-search").val().toLowerCase().trim());

    if (searchValue.length > 0) {
        $(".izdelki-grid").empty();
        $.each(listItems, function (key, value) {
            if (String(value.znamka).toLowerCase().trim().includes(searchValue) ||
                String(value.naziv ).toLowerCase().trim().includes(searchValue) ||
                String(value.opis  ).toLowerCase().trim().includes(searchValue) ||
                String(value.cena  ).toLowerCase().trim().includes(searchValue)) {

                loadIzdelek(value.identify, value.znamka, value.naziv, value.zaloga, value.cena, value.opis, value.slika);
            }
        });
    }
    else {
        refreshItems();
    }
}

$("#dodajanje-produkta").click(() => {
    $("#input-form").show();
    $("input, select, textarea").removeClass("border-error");
    $("input, select, textarea").removeClass("border-success");
    $(".error").hide();
});

$("#cancel-form").click(() => {
    $("#input-form").hide();
    $("input, select, textarea").removeClass("border-error");
    $("input, select, textarea").removeClass("border-success");
    $("input, select, textarea").val("");
    $(".error").hide();
    slikaIzdelka = "https://via.placeholder.com/350x250";
});

$("input[type='radio'][name='zaloga']").on("change", () => {
    refreshItems();
    $(".izdelki-grid").empty();
    $.each(listItems, (key, value) => {
        if($("input[type='radio'][name='zaloga']:checked").val() == value.zaloga){
            loadIzdelek(value.identify, value.znamka, value.naziv, value.zaloga, value.cena, value.opis, value.slika);
        }
    });
});

$("#resetFilter").click(() => {
    $("input[type='radio'][name='zaloga']").prop("checked", false);
    refreshItems();
});