
$(document).ready(function () {

    const rooms = [
        { id: "balcony", name: "Balcony", floor: 2 },
        { id: "hall", name: "Hall", floor: 2 },
        { id: "kitchen", name: "Kitchen", floor: 1 },
        { id: "living", name: "Living room", floor: 1 }
    ];

    const originalGuests = [
        { id: "rigen", name: "Rigen", room: "balcony", color: "green", time: "20:45", aitu: true, things: ["glasses", "cup"] },
        { id: "aya", name: "Aya", room: "balcony", color: "yellow", time: "20:15", aitu: false, things: ["phone"] },
        { id: "madina", name: "Madina", room: "balcony", color: "black", time: "22:10", aitu: false, things: ["phone", "bag"] },
        { id: "ivan", name: "Ivan", room: "balcony", color: "red", time: "20:30", aitu: true, things: ["phone"] },

        { id: "arman", name: "Arman", room: "hall", color: "yellow", time: "20:25", aitu: false, things: ["glasses", "bag"] },
        { id: "sophia", name: "Sophia", room: "hall", color: "purple", time: "21:20", aitu: true, things: ["phone"] },
        { id: "dias", name: "Dias", room: "hall", color: "green", time: "19:45", aitu: true, things: ["cup"] },
        { id: "bekzat", name: "Bekzat", room: "hall", color: "purple", time: "20:55", aitu: false, things: ["bag", "cup"] },
        { id: "aruzhan", name: "Aruzhan", room: "hall", color: "blue", time: "21:50", aitu: true, things: ["phone"] },
        { id: "saule", name: "Saule", room: "hall", color: "green", time: "21:25", aitu: false, things: ["glasses"] },

        { id: "nurlan", name: "Nurlan", room: "kitchen", color: "red", time: "19:40", aitu: true, things: ["phone", "cup"] },
        { id: "emma", name: "Emma", room: "kitchen", color: "black", time: "20:15", aitu: false, things: ["bag"] },
        { id: "timur", name: "Timur", room: "kitchen", color: "green", time: "21:05", aitu: true, things: ["phone", "bag"] },
        { id: "sergey", name: "Sergey", room: "kitchen", color: "purple", time: "20:50", aitu: false, things: ["glasses", "cup"] },
        { id: "yerlan", name: "Yerlan", room: "kitchen", color: "red", time: "21:40", aitu: true, things: ["glasses"] },
        { id: "kamila", name: "Kamila", room: "kitchen", color: "green", time: "20:05", aitu: false, things: ["cup"] },

        { id: "daniel", name: "Daniel", room: "living", color: "blue", time: "20:55", aitu: true, things: ["glasses"] },
        { id: "zarina", name: "Zarina", room: "living", color: "green", time: "21:10", aitu: false, things: ["phone", "bag", "crumbs"] },
        { id: "natasha", name: "Natasha", room: "living", color: "yellow", time: "20:30", aitu: true, things: ["glasses"] },
        { id: "askar", name: "Askar", room: "living", color: "black", time: "21:00", aitu: true, things: ["phone"] },
        { id: "inkar", name: "Inkar", room: "living", color: "purple", time: "20:20", aitu: false, things: ["bag"] }
    ];

    let guests = originalGuests.map(guest => ({
        ...guest,
        things: [...guest.things]
    }));

    const initialOrder = {};

    rooms.forEach(room => {
        initialOrder[room.id] = guests
            .filter(guest => guest.room === room.id)
            .map(guest => guest.id);
    });

    const itemIcons = {
        phone: "📱",
        glasses: "👓",
        bag: "👜",
        cup: "☕",
        crumbs: "🍰"
    };

    const itemNames = {
        phone: "a phone",
        glasses: "glasses",
        bag: "a bag",
        cup: "a cup",
        crumbs: "cake crumbs"
    };

    const roomNames = {
        balcony: "Balcony",
        hall: "Hall",
        kitchen: "Kitchen",
        living: "Living room"
    };

    const cases = [
        "Who is in the hall?",
        "Who is dressed in yellow or purple?",
        "Which AITU students are upstairs?",
        "Who has glasses or a bag?",
        "Who came with nothing at all?",
        "Who has a phone but no bag?",
        "Who arrived between 20:30 and 21:00?",
        "Who arrived after 21:00 and is not an AITU student?",
        "Who stands right next to Askar?",
        "Who stands last in each room?",
        "Who stands third in each room?",
        "Who stands after Timur in his room?",
        "Who stands right before someone in black?",
        "In which room is Aruzhan?",
        "Which rooms have fewer than 6 guests?",
        "Which rooms have a cup but nobody wears glasses?",
        "Who came first to each room?",
        "Miras joins Askar and Inkar.",
        "Natasha goes home.",
        "Who took the cake?"
    ];

    const sortStates = {};

    function getTimeValue(time) {
        return Number(time.replace(":", ""));
    }

    function getGuest(id) {
        return guests.find(guest => guest.id === id);
    }

    function createGuestCard(guest) {

        const icons = guest.things.map(item => {
            return `<span class="item-icon" title="${itemNames[item]}">${itemIcons[item]}</span>`;
        }).join("");

        const badge = guest.aitu
            ? '<span class="aitu-badge" title="AITU student">A</span>'
            : "";

        return $(`
            <button
                type="button"
                class="guest-card color-${guest.color}"
                data-id="${guest.id}"
                data-name="${guest.name}"
                data-room="${guest.room}"
                data-floor="${rooms.find(room => room.id === guest.room).floor}"
                data-color="${guest.color}"
                data-time="${guest.time}"
                data-aitu="${guest.aitu}"
                data-things="${guest.things.join(",")}"
                style="--guest-color:var(--${guest.color})">

                <span class="avatar-container">
                    <img
                        class="avatar"
                        src="https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(guest.name)}"
                        alt="${guest.name}">
                    ${badge}
                </span>

                <span class="guest-name">${guest.name}</span>

                <span class="guest-time">◷ ${guest.time}</span>

                <span class="guest-items">${icons}</span>

            </button>
        `);
    }

    function renderParty() {

        rooms.forEach(room => {

            const $list = $(`#room-${room.id} .guest-list`);

            $list.empty();

            guests
                .filter(guest => guest.room === room.id)
                .forEach(guest => {
                    $list.append(createGuestCard(guest));
                });

            $(`#room-${room.id} .guest-count`)
                .text(`${$list.children().length} guests`);
        });

        bindGuestClicks();
    }

    function bindGuestClicks() {

        $(".guest-card").off("click").on("click", function () {

            const id = $(this).data("id");

            openGuestModal(id);
        });
    }

    function createCaseButtons() {

        cases.forEach((description, index) => {

            $("#case-buttons").append(`
                <button class="case-button" data-case="${index + 1}">
                    <span>CASE ${(index + 1).toString().padStart(2, "0")}</span>
                    ${description}
                </button>
            `);
        });
    }

    function updateCounts() {

        rooms.forEach(room => {

            const count = guests.filter(guest => {
                return guest.room === room.id;
            }).length;

            $(`#room-${room.id} .guest-count`)
                .text(`${count} guests`);
        });
    }

    function clearHighlights() {

        $(".guest-card")
            .stop(true, true)
            .removeClass("case-match dimmed selected")
            .css("opacity", 1);

        $(".room").removeClass("room-match");

        $(".case-button").removeClass("active");
    }

    function showResult(title, names, roomIds = []) {

        const uniqueNames = [...new Set(names)];

        const nameText = uniqueNames.length
            ? uniqueNames.join(", ")
            : "No matching guests";

        const roomText = roomIds.length
            ? ` Rooms: ${roomIds.map(id => roomNames[id]).join(", ")}.`
            : "";

        $("#result-title").text(title);

        $("#result-text").text(
            `${uniqueNames.length} guest(s) found: ${nameText}.${roomText}`
        );
    }

    function highlightGuests($found, title) {

        $(".guest-card")
            .stop(true, true)
            .fadeTo(300, 0.2)
            .addClass("dimmed");

        $found
            .stop(true, true)
            .removeClass("dimmed")
            .fadeTo(300, 1)
            .addClass("case-match");

        $found.each(function (index) {

            $(this)
                .stop(true, true)
                .delay(index * 60)
                .animate({ top: "-=8px" }, 130)
                .animate({ top: "+=8px" }, 130);
        });

        const names = $found.map(function () {
            return $(this).data("name");
        }).get();

        showResult(title, names);
    }

    function highlightRooms(roomIds, title) {

        $(".guest-card")
            .stop(true, true)
            .fadeTo(300, 0.2)
            .addClass("dimmed");

        $(".room").removeClass("room-match");

        roomIds.forEach(id => {

            const $room = $(`#room-${id}`);

            $room.addClass("room-match");

            $room.find(".guest-card")
                .stop(true, true)
                .fadeTo(300, 1)
                .removeClass("dimmed")
                .addClass("case-match");
        });

        const names = $(".guest-card.case-match")
            .map(function () {
                return $(this).data("name");
            })
            .get();

        showResult(title, names, roomIds);
    }

    function rebuildAndInvestigate(number) {

        const title = cases[number - 1];

        renderParty();

        clearHighlights();

        let $found = $();

        let roomIds = [];

        switch (number) {

            case 1:

                $found = $(".room-hall .guest-card");

                break;

            case 2:

                $found = $(".guest-card[data-color='yellow']")
                    .add(".guest-card[data-color='purple']");

                break;

            case 3:

                $found = $(".guest-card[data-aitu='true']")
                    .filter("[data-floor='2']");

                break;

            case 4:

                $found = $(".guest-card")
                    .has(".item-icon[title='glasses']")
                    .add(
                        $(".guest-card").has(".item-icon[title='a bag']")
                    );

                break;

            case 5:

                $found = $(".guest-card[data-things='']");

                break;

            case 6:

                $found = $(".guest-card")
                    .has(".item-icon[title='a phone']")
                    .not(":has(.item-icon[title='a bag'])");

                break;

            case 7:

                $found = $(".guest-card").filter(function () {

                    const time = getTimeValue($(this).data("time"));

                    return time >= 2030 && time <= 2100;
                });

                break;

            case 8:

                $found = $(".guest-card[data-aitu='false']")
                    .filter(function () {

                        return getTimeValue($(this).data("time")) > 2100;
                    });

                break;

            case 9:

                $found = $(".guest-card[data-id='askar']")
                    .prev()
                    .add(
                        $(".guest-card[data-id='askar']").next()
                    );

                break;

            case 10:

                $found = $(".guest-list")
                    .children(".guest-card:last-child");

                break;

            case 11:

                $found = $(".guest-list")
                    .children(".guest-card:nth-child(3)");

                break;

            case 12:

                $found = $(".guest-card[data-id='timur']")
                    .nextAll(".guest-card")
                    .first();

                break;

            case 13:

                $found = $(".guest-card[data-color='black']")
                    .prev(".guest-card");

                break;

            case 14:

                roomIds = [
                    $(".guest-card[data-id='aruzhan']")
                        .closest(".room")
                        .data("room")
                ];

                break;

            case 15:

                roomIds = $(".room")
                    .filter(function () {

                        return $(this).find(".guest-card").length < 6;
                    })
                    .map(function () {
                        return $(this).data("room");
                    })
                    .get();

                break;

            case 16:

                roomIds = $(".room")
                    .filter(function () {

                        const $cards = $(this).find(".guest-card");

                        const hasCup = $cards.has(
                            ".item-icon[title='a cup']"
                        ).length > 0;

                        const nobodyHasGlasses = $cards.filter(
                            ":has(.item-icon[title='glasses'])"
                        ).length === 0;

                        return hasCup && nobodyHasGlasses;
                    })
                    .map(function () {
                        return $(this).data("room");
                    })
                    .get();

                break;

            case 17:

                $(".guest-list").each(function () {

                    const $cards = $(this).children(".guest-card");

                    const firstTime = Math.min(
                        ...$cards.map(function () {
                            return getTimeValue($(this).data("time"));
                        }).get()
                    );

                    $found = $found.add(
                        $cards.filter(function () {
                            return getTimeValue($(this).data("time")) === firstTime;
                        }).first()
                    );
                });

                break;

            case 18:

                addMiras();

                return;

            case 19:

                removeNatasha();

                return;

            case 20:

                $found = $(".guest-card").filter(function () {

                    const $card = $(this);

                    const time = getTimeValue($card.data("time"));

                    const downstairs = $card.data("floor") === 1;

                    const hasCrumbs = $card.has(
                        ".item-icon[title='cake crumbs']"
                    ).length > 0;

                    const hasNoCup = $card.find(
                        ".item-icon[title='a cup']"
                    ).length === 0;

                    const nextToAITU = (
                        $card.prev(".guest-card[data-aitu='true']").length > 0 ||
                        $card.next(".guest-card[data-aitu='true']").length > 0
                    );

                    return downstairs &&
                        time > 2100 &&
                        time < 2130 &&
                        hasCrumbs &&
                        hasNoCup &&
                        nextToAITU;
                });

                break;
        }

        if (roomIds.length > 0) {

            highlightRooms(roomIds, title);

        } else {

            highlightGuests($found, title);
        }
    }

    function addMiras() {

        if (getGuest("miras")) {

            const $miras = $(".guest-card[data-id='miras']");

            highlightGuests($miras, "Miras is already at the party");

            return;
        }

        const miras = {
            id: "miras",
            name: "Miras",
            room: "living",
            color: "blue",
            time: "21:20",
            aitu: true,
            things: ["phone"]
        };

        guests.splice(
            guests.findIndex(guest => guest.id === "inkar"),
            0,
            miras
        );

        const $miras = createGuestCard(miras).hide();

        $(".guest-card[data-id='askar']").after($miras);

        $miras.fadeIn(600);

        updateCounts();

        bindGuestClicks();

        $(".guest-card").not($miras).addClass("dimmed");

        $miras.addClass("case-match");

        showResult(
            "Miras joined between Askar and Inkar",
            ["Miras"]
        );
    }

    function removeNatasha() {

        const $natasha = $(".guest-card[data-id='natasha']");

        if (!$natasha.length) {

            showResult("Natasha has already left", []);

            return;
        }

        $natasha.stop(true, true).fadeOut(600, function () {

            guests = guests.filter(guest => guest.id !== "natasha");

            $(this).remove();

            updateCounts();

            showResult("Natasha left the party", []);
        });
    }

    function openGuestModal(id) {

        const guest = getGuest(id);

        if (!guest) return;

        closeGuest(false);

        $(".guest-card").removeClass("selected");

        $(`.guest-card[data-id='${id}']`).addClass("selected");

        const itemsText = guest.things.length
            ? guest.things.map(item => itemNames[item]).join(", ")
            : "nothing";

        const facts = [
            `Arrival time: ${guest.time}`,
            guest.aitu ? "AITU student" : "Not an AITU student",
            `Clothing color: ${guest.color}`,
            `Personal items: ${itemsText}`,
            `Current room: ${roomNames[guest.room]}`
        ];

        const moveButtons = rooms
            .filter(room => room.id !== guest.room)
            .map(room => `
                <button class="move-button" data-target="${room.id}">
                    Move to ${room.name}
                </button>
            `).join("");

        $("#modal-content").html(`
            <div class="modal-person">
                <img
                    src="https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(guest.name)}"
                    alt="${guest.name}"
                    style="--guest-color:var(--${guest.color})">

                <div>
                    <h2>${guest.name}</h2>
                    <p>${roomNames[guest.room]} · ${guest.time}</p>
                </div>
            </div>

            <div class="modal-facts">
                ${facts.map((fact, index) => `
                    <div class="modal-fact">
                        <span>${["◷", "🎓", "🎨", "🎒", "⌂"][index]}</span>
                        ${fact}
                    </div>
                `).join("")}
            </div>

            <div class="modal-moves">
                <p>MOVE THIS GUEST</p>
                <div class="move-buttons">
                    ${moveButtons}
                </div>
            </div>
        `);

        $("#modal-backdrop").stop(true, true).fadeIn(200);

        $("#guest-modal")
            .stop(true, true)
            .css({
                display: "block",
                opacity: 1,
                transform: "translate(-50%, -50%) scale(.1)"
            });

        $("#guest-modal").animate(
            { modalScale: 1 },
            {
                duration: 300,
                step: function (now) {
                    $(this).css(
                        "transform",
                        `translate(-50%, -50%) scale(${now})`
                    );
                },
                complete: function () {
                    $(this).css(
                        "transform",
                        "translate(-50%, -50%) scale(1)"
                    );
                }
            }
        );

        $("#modal-content")
            .off("click", ".move-button")
            .on("click", ".move-button", function () {

                moveGuest(id, $(this).data("target"));
            });
    }

    function closeGuest(animateClose = true) {

        const $modal = $("#guest-modal");

        if ($modal.css("display") === "none") return;

        if (!animateClose) {

            $modal.stop(true, true).hide();

            $("#modal-backdrop").stop(true, true).hide();

            $(".guest-card").removeClass("selected");

            return;
        }

        $modal.stop(true, true).animate(
            { modalScale: 0.1 },
            {
                duration: 200,
                step: function (now) {
                    $(this).css(
                        "transform",
                        `translate(-50%, -50%) scale(${now})`
                    );
                },
                complete: function () {
                    $(this).hide();
                    $(this).css(
                        "transform",
                        "translate(-50%, -50%) scale(.1)"
                    );
                }
            }
        );

        $("#modal-backdrop").stop(true, true).fadeOut(200);

        $(".guest-card").removeClass("selected");
    }

    function moveGuest(id, targetRoom) {

        const guest = getGuest(id);

        if (!guest || guest.room === targetRoom) {

            closeGuest();

            return;
        }

        const oldRoom = guest.room;

        const $card = $(`.guest-card[data-id='${id}']`);

        const $oldList = $card.closest(".guest-list");

        const $newList = $(`#room-${targetRoom} .guest-list`);

        const start = $card.offset();

        const $clone = $card.clone();

        $clone.css({
            position: "absolute",
            left: start.left,
            top: start.top,
            width: $card.outerWidth(),
            zIndex: 1000,
            margin: 0
        });

        $("body").append($clone);

        const $placeholder = $("<div>").css({
            width: $card.outerWidth(),
            height: $card.outerHeight(),
            flex: "0 0 auto"
        });

        $card.after($placeholder);

        $card.hide();

        closeGuest();

        guest.room = targetRoom;

        $card.attr("data-room", targetRoom);

        $card.attr(
            "data-floor",
            rooms.find(room => room.id === targetRoom).floor
        );

        initialOrder[oldRoom] = initialOrder[oldRoom]
            .filter(item => item !== id);

        initialOrder[targetRoom].push(id);

        $newList.append($card);

        const end = $card.offset();

        $clone.stop(true, true).animate(
            {
                left: end.left,
                top: end.top
            },
            650,
            function () {

                $clone.remove();

                $placeholder.remove();

                $card.show();

                $oldList.children(".guest-card")
                    .stop(true, true)
                    .animate({ marginLeft: "4px" }, 150)
                    .animate({ marginLeft: "0px" }, 150);

                $newList.children(".guest-card")
                    .stop(true, true)
                    .animate({ marginTop: "5px" }, 150)
                    .animate({ marginTop: "0px" }, 150);

                updateCounts();

                bindGuestClicks();
            }
        );
    }

    function sortRoom(roomId) {

        const $list = $(`#room-${roomId} .guest-list`);

        const currentIds = $list.children(".guest-card")
            .map(function () {
                return $(this).data("id");
            })
            .get();

        const sortedIds = currentIds.slice().sort((a, b) => {

            return getTimeValue(getGuest(a).time) -
                getTimeValue(getGuest(b).time);
        });

        const originalIds = initialOrder[roomId].filter(id => {
            return getGuest(id) && getGuest(id).room === roomId;
        });

        const targetIds = sortStates[roomId]
            ? originalIds
            : sortedIds;

        sortStates[roomId] = !sortStates[roomId];

        const oldPositions = {};

        const elements = {};

        $list.children(".guest-card").each(function () {

            const id = $(this).data("id");

            oldPositions[id] = $(this).position();

            elements[id] = $(this).detach();
        });

        targetIds.forEach(id => {

            $list.append(elements[id]);
        });

        const $cards = $list.children(".guest-card");

        $cards.each(function () {

            const id = $(this).data("id");

            const oldPosition = oldPositions[id];

            const newPosition = $(this).position();

            $(this).css({
                position: "relative",
                left: oldPosition.left - newPosition.left,
                top: oldPosition.top - newPosition.top
            });
        });

        $cards.stop(true, true).animate(
            {
                left: 0,
                top: 0
            },
            450,
            function () {

                $(this).css({
                    position: "",
                    left: "",
                    top: ""
                });
            }
        );

        bindGuestClicks();
    }

    $("#case-buttons").on("click", ".case-button", function () {

        const number = Number($(this).data("case"));

        $(".case-button").removeClass("active");

        $(this).addClass("active");

        rebuildAndInvestigate(number);
    });

    $("#clear-spotlight").on("click", function () {

        $(".guest-card")
            .stop(true, true)
            .fadeTo(300, 1)
            .removeClass("dimmed case-match selected");

        $(".room").removeClass("room-match");

        $(".case-button").removeClass("active");
    });

    $("#reset-party").on("click", function () {

        guests = originalGuests.map(guest => ({
            ...guest,
            things: [...guest.things]
        }));

        rooms.forEach(room => {

            initialOrder[room.id] = originalGuests
                .filter(guest => guest.room === room.id)
                .map(guest => guest.id);
        });

        Object.keys(sortStates).forEach(key => {
            delete sortStates[key];
        });

        closeGuest(false);

        renderParty();

        clearHighlights();

        $("#result-title").text("Party reset");

        $("#result-text").text(
            "All guests have returned to their original rooms and positions."
        );
    });

    $(".room").on("click", ".sort-button", function () {

        const roomId = $(this).closest(".room").data("room");

        sortRoom(roomId);
    });

    $("#close-modal, #modal-backdrop").on("click", function () {

        closeGuest();
    });

    $(document).on("keydown", function (event) {

        if (event.key === "Escape") {

            closeGuest();
        }
    });

    createCaseButtons();

    renderParty();

});
