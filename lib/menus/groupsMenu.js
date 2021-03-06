class GroupsMenu extends Menu {
    get modelClass() {
        return Group;
    }

    beforeInitialize() {
        this.equasion = new Equasion();
        this.favourite = new Favourite();
        this.history = new History();
    }

    afterInitialize() {
        $(document).on("click", "[data-action='createGroup']", e => this.createGroup(e));
        $(document).on("click", "[data-action='editGroup']", e => this.editGroup(e));
        $(document).on("click", "[data-action='updateGroup']", e => this.updateGroup(e));
        $(document).on("click", "[data-action='deleteGroup']", e => this.deleteGroup(e));
        $(document).on("click", "[data-action='addFavouriteToGroup']", e => this.addFavouriteToGroup(e));
        $(document).on("click", "[data-action='addHistoryItemToGroup']", e => this.addHistoryItemToGroup(e));
        $(document).on("click", "[data-action='removeRollFromGroup']", e => this.removeRollFromGroup(e));
        $(document).on("click", "[data-action='toggleGroupRolls']", e => this.toggleGroupRolls(e));
        $(document).on("click", "[data-action='executeGroup']", e => this.executeGroup(e));

        $(document).on("favouriteUpdated", e => this.updateFavouritesRecommendations(e));
        $(document).on("historyItemUpdated", e => this.updateHistoryItemsRecommendations(e));
    }

    get favourites() {
        return this.favourite.all;
    }

    get historyItems() {
        return this.history.all.reverse();
    }

    hasItems() {
        return true;
    }

    createGroup(e) {
        if (this.items.length >= 10) {
            alert("Reached maximum saved groups!");
        } else {
            let item = { id: ID(), name: "New Group", rolls: [] };

            this.items.push(item);

            this.saveItems();

            this.addItemToDisplay(item);
        }
    }

    editGroup(e) {
        let element = $(e.target).parents("div.element[data-id]");

        element.addClass("editing");
        element.find(".group-rolls").removeClass("hidden");
    }

    updateGroup(e) {
        let element = $(e.target).parents("div.element[data-id]");
        let id = element.data("id");
        let item = this.items.find(item => item.id == id);

        item.name = element.find("input.name").val();

        this.saveItems();

        element.replaceWith(this.itemHTML(item));
    }

    deleteGroup(e) {
        let element = $(e.target).parents("div.element[data-id]");
        let id = element.data("id");

        this.items = this.items.filter(item => item.id != id);
        this.saveItems();

        element.remove();
    }

    addFavouriteToGroup(e) {
        let element = $(e.target).parents("div.element[data-id]");
        let id = element.data("id");
        let group = this.items.find(item => item.id == id);

        let favouriteId = $(e.target).parents("div.recommendation[data-id]").data("id");
        let favouriteItem = this.favourites.find(item => item.id == favouriteId);

        favouriteItem.id = ID();
        group.rolls.push(favouriteItem);

        this.saveItems();

        element.find(".group-rolls").append(this.groupRollHTML(favouriteItem));
    }

    addHistoryItemToGroup(e) {
        let element = $(e.target).parents("div.element[data-id]");
        let id = element.data("id");
        let group = this.items.find(item => item.id == id);

        let historyItemId = $(e.target).parents("div.recommendation[data-id]").data("id");
        let historyItem = this.historyItems.find(item => item.id == historyItemId);

        historyItem.id = ID();
        group.rolls.push(historyItem);

        this.saveItems();

        element.find(".group-rolls").append(this.groupRollHTML(historyItem));
    }

    removeRollFromGroup(e) {
        let element = $(e.target).parents("div.element[data-id]");
        let id = element.data("id");
        let group = this.items.find(item => item.id == id);

        let rollElement = $(e.target).parents("div.group-roll[data-id]");
        let rollId = rollElement.data("id");

        group.rolls = group.rolls.filter(roll => roll.id != rollId);
        this.saveItems();

        rollElement.remove();
    }

    executeGroup(e) {
        let element = $(e.target).parents("div.element[data-id]");
        let id = element.data("id");
        let group = this.items.find(item => item.id == id);

        element.find(".group-rolls").removeClass("hidden");

        group.rolls.forEach(roll => {
            let equasion = this.equasion.fromString(roll.value);

            if (equasion.valid) {
                element.find(`.group-roll[data-id="${roll.id}"] .result`).html(equasion.result);
            } else {
                element.find(`.group-roll[data-id="${roll.id}"] .result`).html("INVALID");
            }
        })
    }

    toggleGroupRolls(e) {
        let element = $(e.target).parents("div.element[data-id]");

        element.find(".group-rolls").toggleClass("hidden");
    }

    addItemToDisplay(item) {
        if (this.displayElement.children().length > 11) {
            this.displayElement.children(":nth-last-child(2)").remove();
        }

        $(this.itemHTML(item)).insertBefore(this.displayElement.find("[data-action='createGroup']"));
    }

    groupRollHTML(roll) {
        return `
        <div class="group-roll" data-id="${roll.id}">
            <div class="reorder clickable material-icons">reorder</div>
            <div class="arrow material-icons">subdirectory_arrow_right</div>
            <div class="roll-name">
                ${roll.name ? `<span>${roll.name}</span>` : ''}
                <span class="roll-value">(${roll.value})</span>
            </div>
            <div class="result"></div>
            <div class="hidden clickable material-icons delete" data-action="removeRollFromGroup">delete</div>
        </div>
        `;
    }

    updateFavouritesRecommendations() {
        this.displayElement.find(".group.element .recommendations .favourites").replaceWith(this.favouritesRecommendations());
    }

    updateHistoryItemsRecommendations() {
        this.displayElement.find(".group.element .recommendations .history-items").replaceWith(this.historyItemsRecommendations());
    }

    favouritesRecommendations() {
        return `
            <div class="favourites">
                ${this.favourites.map(favourite => `
                    <div class="recommendation clickable" data-id="${favourite.id}" data-action="addFavouriteToGroup">
                        <div class="icon material-icons">add</div>
                        <div class="roll-name">
                            <span>${favourite.name}</span>
                            <span class="roll-value">(${favourite.value})</span>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
    }

    historyItemsRecommendations() {
        return `
            <div class="history-items">
                ${this.historyItems.map(item => `
                    <div class="recommendation clickable" data-id="${item.id}" data-action="addHistoryItemToGroup">
                        <div class="icon material-icons">add</div>
                        <div class="roll-name">
                            ${item.name ? `<span>${item.name}</span>` : ''}
                            <span class="roll-value">(${item.value})</span>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
    }

    itemHTML(item) {
        return `
            <div class="group element" data-id="${item.id}">
                <div class="editor">
                    <div class="clickable material-icons submit" data-action="updateGroup">check</div>
                    <div class="details">
                        <input class="name" type="value" value="${item.name}">
                    </div>
                    <div class="clickable material-icons delete" data-target="${item.id}" data-action="deleteGroup">delete</div>
                </div>
                <div class="viewer">
                    <div class="clickable material-icons edit" data-action="editGroup">edit</div>
                    <div class="clickable details" data-action="toggleGroupRolls">
                        <div class="name">${item.name}</div>
                    </div>
                    <div class="clickable material-icons roll" data-action="executeGroup">replay</div>
                </div>
                <div class="group-rolls hidden">
                    ${item.rolls.map(roll => this.groupRollHTML(roll)).join("")}
                </div>
                <div class="recommendations">
                    <div class="small-header">
                        <div>Add a roll from favourites</div>
                    </div>
                    ${this.favouritesRecommendations()}
                    <div class="small-header">
                        <div>Add a roll from history</div>
                    </div>
                    ${this.historyItemsRecommendations()}
                </div>
            </div>
        `;
    }
}