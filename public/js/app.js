const search = () => {
    const searchbox = document.getElementById("search-item").value.toUpperCase();
    const storeitems = document.getElementById("book-list");
    const product = document.querySelectorAll(".book");
    const pname = storeitems.getElementsByTagName("a");
  
    for (var i = 0; i < pname.length; i++) {
      let match = pname[i].textContent || pname[i].innerHTML;
  
      if (match.toUpperCase().indexOf(searchbox) > -1) {
        product[i].style.display = "";
      } else {
        product[i].style.display = "none";
      }
    }
  };
  