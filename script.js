function debounce(callback, delay) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(callback, delay);
    };
  }
  
  class View {
    constructor() {
      this.api = this.createElement("div");
      document.body.appendChild(this.api);
  
      this.searchLine = this.createElement("div", "search-line");
      this.searchForm = this.createElement("input", "search-form");
      this.searchCounter = this.createElement("span", "counter");
  
      this.searchLine.append(this.searchForm);
      this.searchLine.append(this.searchCounter);
  
      this.repsWrapper = this.createElement("div", "reps-wrapper");
      this.repsList = this.createElement("ul", "reps");
      this.repsWrapper.append(this.repsList);
  
      this.main = this.createElement("div", "main");
      this.main.append(this.repsWrapper);
  
      this.api.append(this.searchLine);
      this.api.append(this.main);
    }
  
    createElement(elementTag, elementClass) {
      let element = document.createElement(elementTag);
      if (elementClass) {
        element.classList.add(elementClass);
      }
      return element;
    }
  
    deleteElement(el) {
      el.remove();
    }
  
    createReps(item) {
      const repItem = this.createElement("li", "rep-prev");
      repItem.textContent = item.name;
      this.repsList.append(repItem);
  
      repItem.addEventListener("click", () => {
        this.searchForm.value = "";
        this.repsList.textContent = "";
        const selectedRepsWrapper = this.createElement("div", "card");
        const selectedRepList = this.createElement("div", "reps-list");
  
        const repName = this.createElement("div");
        repName.textContent = `Name: ${item.name}`;
        selectedRepList.append(repName);
  
        const repOwner = this.createElement("div");
        repOwner.textContent = `Owner: ${item.owner["login"]}`;
        selectedRepList.append(repOwner);
  
        const repStars = this.createElement("div");
        repStars.textContent = `Stars: ${item.stargazers_count}`;
        selectedRepList.append(repStars);
  
        const open = this.createElement("div", "open");
        const openImg = this.createElement("img");
        openImg.src = "open2.svg";
        open.append(openImg);
  
        selectedRepsWrapper.append(selectedRepList);
        selectedRepsWrapper.append(open);
  
        this.main.append(selectedRepsWrapper);
  
        open.addEventListener(
          "click",
          this.deleteElement.bind(this, selectedRepsWrapper)
        );
      });
    }
  }
  
  class Search {
    constructor(view) {
      this.view = view;
      this.view.searchForm.addEventListener(
        "input",
        debounce(this.searchReps.bind(this), 450)
      );
    }
  
    async searchReps() {
      if (
        this.view.searchForm.value &&
        this.view.searchForm.value.charAt(0) !== " "
      ) {
        return await fetch(
          `https://api.github.com/search/repositories?q=${this.view.searchForm.value}`
        ).then((res) => {
          this.clearRepsList();
          res.json().then((res) => {
            let count = 0;
            do {
              this.view.createReps(res.items[count]);
            } while (++count < 5);
          });
        });
      } else {
        this.clearRepsList();
        this.view.searchForm.value = "";
      }
    }
  
    clearRepsList() {
      this.view.repsList.textContent = "";
    }
  }
  
  document.body.className = "body";
  new Search(new View());
  