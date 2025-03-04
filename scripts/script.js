document.addEventListener("DOMContentLoaded", function () {
    const bookList = document.getElementById("bookList");
    const addForm = document.getElementById("addForm");
    const searchInput = document.getElementById("search");
    const celebrationDiv = document.getElementById("celebration");
  
    let books = [];
  
    // Core Task 3: Add 
    addForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const author = document.getElementById("author").value;
      const genre = document.getElementById("genre").value;
      const status = document.getElementById("status").value;
      const comments = document.getElementById("Comments").value;
  
      const book = { title, author, genre, status, comments, rating: null };
      books.push(book);
      books.sort((a, b) => a.title.localeCompare(b.title)); // Sort books alphabetically by title
      renderBooks();
      addForm.reset();
    });
  
    // Core Task 7: Rating
    function renderBooks(filteredBooks = books) {
      bookList.innerHTML = "";
      filteredBooks.forEach((book, index) => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
          <div class="card">
            <img src="https://via.placeholder.com/200x300" class="card-img-top" alt="${book.title}">
            <div class="card-body">
              <h5 class="card-title">${book.title}</h5>
              <p class="card-text"><strong>Author:</strong> ${book.author}</p>
              <p class="card-text"><strong>Genre:</strong> ${book.genre}</p>
              <p class="card-text"><strong>Status:</strong> ${book.status}</p>
              <p class="card-text"><strong>Comments:</strong> ${book.comments}</p>
              <select class="form-select mb-2 status" data-index="${index}">
                <option value="to read" ${book.status === "to read/watch" ? "selected" : ""}>To Read/Watch</option>
                <option value="in progress" ${book.status === "in progress" ? "selected" : ""}>In Progress</option>
                <option value="completed" ${book.status === "completed" ? "selected" : ""}>Completed</option>
              </select>
              <input type="number" class="form-control mb-2 rating" data-index="${index}" min="1" max="5" ${book.status !== "completed" ? "disabled" : ""} value="${book.rating || ""}" placeholder="Rating (1-5)">
              <button class="btn btn-danger w-100 delete" data-index="${index}">Delete</button>
            </div>
          </div>
        `;
        bookList.appendChild(card);
      });
  
      // Core Task 4: Statuses
      document.querySelectorAll(".status").forEach((select) => {
        select.addEventListener("change", function () {
          const index = this.getAttribute("data-index");
          books[index].status = this.value;
  
          // Core Task 10: Celebration
          if (this.value === "completed") {
            celebrationDiv.style.display = "block";
            const celebrationSound = document.getElementById("celebrationSound");
            celebrationSound.play();

            setTimeout(() => {
              celebrationSound.pause();
              celebrationSound.currentTime = 0; // Reset audio to start
              celebrationDiv.style.display = "none";
            }, 6000); 
          }
  
          renderBooks();
        });
      });
  
      document.querySelectorAll(".rating").forEach((input) => {
        input.addEventListener("change", function () {
          const index = this.getAttribute("data-index");
          books[index].rating = this.value;
        });
      });
  
      // Core Task 5: Delete
      document.querySelectorAll(".delete").forEach((button) => {
        button.addEventListener("click", function () {
          const index = this.getAttribute("data-index");
          books.splice(index, 1);
          renderBooks();
        });
      });
  
      // Core Task 11: Grouping
      updateGroupOptions();
    }
  
    // Core Task 8: Search
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase();
      const filteredBooks = books.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
      renderBooks(filteredBooks);
    });
  
    // Core Task 11: Group Books by Author and Display Average Rating
    function updateGroupOptions() {
      const groupResults = document.getElementById("groupResults");
      if (!groupResults) return; // Skip if the groupResults section doesn't exist
  
      // Group books by author
      const groupedBooks = books.reduce((acc, book) => {
        if (!acc[book.author]) {
          acc[book.author] = [];
        }
        acc[book.author].push(book);
        return acc;
      }, {});
  
      // Calculate average rating for each group
      const groupDetails = Object.keys(groupedBooks).map((author) => {
        const booksByAuthor = groupedBooks[author];
        const totalRating = booksByAuthor.reduce((sum, book) => sum + (book.rating || 0), 0);
        const averageRating = (totalRating / booksByAuthor.length).toFixed(2);
        return { author, averageRating, count: booksByAuthor.length };
      });
  
      // Display group results
      groupResults.innerHTML = `
        <h3>Grouped by Author</h3>
        <ul>
          ${groupDetails.map((group) => `
            <li>
              <strong>${group.author}</strong>: ${group.count} books, Average Rating: ${group.averageRating}
            </li>
          `).join("")}
        </ul>
      `;
    }

    renderBooks();
  });