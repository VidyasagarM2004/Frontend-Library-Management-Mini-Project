var app = angular.module('libraryApp', []);

app.controller('LibraryController', function($scope, $http) {
    $scope.books = [];
    $scope.loginData = {};
    $scope.registerData = {};
    $scope.contact = {};

    // Load books
    $scope.loadBooks = function() {
        $http.get('data.json')
            .then(function(response) {
                $scope.books = response.data.books;
            })
            .catch(function(error) {
                console.error('Error loading books:', error);
            });
    };

    // View Book Details
    $scope.viewDetails = function(book) {
        alert('Title: ' + book.title + '\nAuthor: ' + book.author);
    };

    // Login
    $scope.login = function(user) {
        if (user && user.universityId && user.password) {
            $http.post('/api/login', user)
                .then(function(response) {
                    if (response.data.success) {
                        alert('Login successful!');
                        $('#loginModal').modal('hide');
                    } else {
                        alert('Login failed: ' + (response.data.message || 'Invalid credentials'));
                    }
                })
                .catch(function(error) {
                    console.error('Login error:', error);
                    alert('Login failed. Please try again.');
                });
        } else {
            alert('Please fill in both University ID and Password.');
        }
    };

    // Register
    $scope.register = function(newUser) {
        if (newUser.password !== newUser.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        $http.post('/api/register', newUser)
            .then(function(response) {
                alert('Registration successful!');
                $('#registerModal').modal('hide');
                $scope.registerData = {}; // Reset form
            })
            .catch(function(error) {
                console.error('Registration error:', error);
                alert('Registration failed.');
            });
    };

    // Search
    $scope.search = function(searchTerm) {
        if (searchTerm) {
            alert('Searching for: ' + searchTerm);
        } else {
            alert('Please enter a search term!');
        }
    };

    // Contact
    $scope.sendContact = function(contact) {
        if (contact.name && contact.email && contact.subject && contact.message) {
            alert('Thank you for contacting us, ' + contact.name + '!');
        } else {
            alert('Please fill all contact fields.');
        }
    };

    // Navbar scroll effect
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('navbar-scrolled');
        } else {
            $('.navbar').removeClass('navbar-scrolled');
        }
    });

    // Smooth Scroll
    $('a[href^="#"]').on('click', function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 70
        }, 800);
    });

    // Load books initially
    $scope.loadBooks();
});


$(document).ready(function() {
    // Function to fetch and display books
    function loadBooks(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const bookListContainer = $('#bookList');
                data.books.forEach(book => {
                    const statusClass = book.status === "Available" ? "bg-success" : "bg-warning text-dark";
                    const bookCard = `
                        <div class="col-md-4 mb-4">
                            <div class="card h-100">
                                <img src="${book.coverImage}" class="card-img-top" alt="Book Cover">
                                <div class="card-body">
                                    <h5 class="card-title">${book.title}</h5>
                                    <p class="card-text">By ${book.author}</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="badge ${statusClass}">${book.status}</span>
                                        <button class="btn btn-sm btn-outline-primary">View Details</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    bookListContainer.append(bookCard);
                });
                // Optionally disable the "Load More" button if all books are loaded
                if (data.books.length < 6) { // Assuming initial load is 6
                    $('#loadMoreBooks').prop('disabled', true).text('No More Books');
                }
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                $('#bookList').html('<p class="text-danger">Failed to load books.</p>');
            });
    }

    // Load initial books when the page loads
    loadBooks('data.json');

    // Handle "Load More Books" button click
    $('#loadMoreBooks').on('click', function() {
        // For a simple static example, we'll just reload the same data.
        // In a real application, you'd likely fetch a different page or subset.
        loadBooks('api/books.json');
        // In a real scenario, you'd need logic to track which books have already been loaded
        // and fetch the next set. You might update the URL or use pagination parameters.
        $(this).prop('disabled', true).text('Loading...'); // Disable temporarily
        setTimeout(() => { // Simulate loading delay
            $(this).prop('disabled', false).text('Load More Books');
            // In a real app, you'd likely remove the button when all books are shown.
        }, 1500);
    });

    // Smooth scrolling for navigation links
    $('a[href^="#"]').on('click', function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 70
        }, 800);
    });

    // Show login modal when login link is clicked
    $('a[href="#login"]').on('click', function(event) {
        event.preventDefault();
        $('#loginModal').modal('show');
    });

    // Form submission handlers (basic alerts for demonstration)
    $('#loginForm').on('submit', function(event) {
        event.preventDefault();
        alert('Login functionality would be implemented here with AJAX to a backend.');
        $('#loginModal').modal('hide');
    });

    $('#registerForm').on('submit', function(event) {
        event.preventDefault();
        alert('Registration functionality would be implemented here with AJAX to a backend.');
        $('#registerModal').modal('hide');
    });

    $('#contactForm').on('submit', function(event) {
        event.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        $(this).trigger('reset');
    });

    // Search functionality (basic alert for demonstration)
    $('.search-box button').on('click', function() {
        const searchTerm = $('.search-box input').val().trim();
        if (searchTerm) {
            alert(`Searching for: ${searchTerm}\nThis would typically involve sending a request to a backend API.`);
        } else {
            alert('Please enter a search term');
        }
    });

    // Book details functionality (basic alert for demonstration)
    $(document).on('click', '.btn-outline-primary', function() {
        alert('Book details would be displayed in a modal or on a separate page, fetched dynamically.');
    });

    // Navbar background change on scroll
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('navbar-scrolled');
        } else {
            $('.navbar').removeClass('navbar-scrolled');
        }
    });
});
$(document).ready(function() {
    // ... (Your existing loadBooks and other JavaScript code) ...

    $('#loginForm').on('submit', function(event) {
        event.preventDefault();
        const universityId = $('#loginEmail').val();
        const password = $('#loginPassword').val();

        // Simulate an AJAX request to a backend
        fetch('/api/login', { // Replace '/api/login' with your actual backend endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ universityId: universityId, password: password }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Login failed: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Login successful!');
                $('#loginModal').modal('hide');
                // Here you would typically update the UI to show the user is logged in
                // (e.g., hide login button, show logout button, user profile).
            } else {
                alert(`Login failed: ${data.message || 'Invalid credentials'}`);
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        });
    });

    // ... (Your other JavaScript code) ...
});
$(document).ready(function() {
    // ... (Your existing JavaScript code) ...

    $('#registerForm').on('submit', function(event) {
        event.preventDefault();
        const name = $('#regName').val();
        const universityId = $('#regEmail').val();
        const password = $('#regPassword').val();
        const confirmPassword = $('#regConfirmPassword').val();

        if (password === confirmPassword) {
            alert('Registration successful (simulated)! You can now try to log in with these details.');
            $('#registerModal').modal('hide');
            // In a real app, you might clear the form here
        } else {
            alert('Registration failed: Passwords do not match.');
        }
    });

    // ... (Your existing JavaScript code) ...
});
$(document).ready(function() {
    // Function to fetch and display books
    function loadBooks(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const bookListContainer = $('#bookList');
                data.books.forEach(book => {
                    const statusClass = book.status === "Available" ? "bg-success" : "bg-warning text-dark";
                    const bookCard = `
                        <div class="col-md-4 mb-4">
                            <div class="card h-100">
                                <img src="${book.coverImage}" class="card-img-top" alt="Book Cover">
                                <div class="card-body">
                                    <h5 class="card-title">${book.title}</h5>
                                    <p class="card-text">By ${book.author}</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="badge ${statusClass}">${book.status}</span>
                                        <button class="btn btn-sm btn-outline-primary">View Details</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    bookListContainer.append(bookCard);
                });
                // Optionally disable the "Load More" button if all books are loaded
                if (data.books.length < 6) { // Assuming initial load is 6
                    $('#loadMoreBooks').prop('disabled', true).text('No More Books');
                }
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                $('#bookList').html('<p class="text-danger">Failed to load books.</p>');
            });
    }

    // Load initial books when the page loads
    loadBooks('data.json');

    // Handle "Load More Books" button click
    $('#loadMoreBooks').on('click', function() {
        // For a simple static example, we'll just reload the same data.
        // In a real application, you'd likely fetch a different page or subset.
        loadBooks('api/books.json');
        // In a real scenario, you'd need logic to track which books have already been loaded
        // and fetch the next set. You might update the URL or use pagination parameters.
        $(this).prop('disabled', true).text('Loading...'); // Disable temporarily
        setTimeout(() => { // Simulate loading delay
            $(this).prop('disabled', false).text('Load More Books');
            // In a real app, you'd likely remove the button when all books are shown.
        }, 1500);
    });

    // Smooth scrolling for navigation links
    $('a[href^="#"]').on('click', function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 70
        }, 800);
    });

    // Show login modal when login link is clicked
    $('a[href="#login"]').on('click', function(event) {
        event.preventDefault();
        $('#loginModal').modal('show');
    });

    // Form submission handlers (basic alerts for demonstration)
    $('#loginForm').on('submit', function(event) {
        event.preventDefault();
        alert('Login functionality would be implemented here with AJAX to a backend.');
        $('#loginModal').modal('hide');
    });

    $('#registerForm').on('submit', function(event) {
        event.preventDefault();
        alert('Registration functionality would be implemented here with AJAX to a backend.');
        $('#registerModal').modal('hide');
    });

    $('#contactForm').on('submit', function(event) {
        event.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        $(this).trigger('reset');
    });

    // Search functionality (basic alert for demonstration)
    $('.search-box button').on('click', function() {
        const searchTerm = $('.search-box input').val().trim();
        if (searchTerm) {
            alert(`Searching for: ${searchTerm}\nThis would typically involve sending a request to a backend API.`);
        } else {
            alert('Please enter a search term');
        }
    });

    // Book details functionality (basic alert for demonstration)
    $(document).on('click', '.btn-outline-primary', function() {
        alert('Book details would be displayed in a modal or on a separate page, fetched dynamically.');
    });

    // Navbar background change on scroll
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('navbar-scrolled');
        } else {
            $('.navbar').removeClass('navbar-scrolled');
        }
    });
});
$(document).ready(function() {
    // ... (Your existing loadBooks and other JavaScript code) ...

    $('#loginForm').on('submit', function(event) {
        event.preventDefault();
        const universityId = $('#loginEmail').val();
        const password = $('#loginPassword').val();

        // Simulate an AJAX request to a backend
        fetch('/api/login', { // Replace '/api/login' with your actual backend endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ universityId: universityId, password: password }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Login failed: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Login successful!');
                $('#loginModal').modal('hide');
                // Here you would typically update the UI to show the user is logged in
                // (e.g., hide login button, show logout button, user profile).
            } else {
                alert(`Login failed: ${data.message || 'Invalid credentials'}`);
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        });
    });

    // ... (Your other JavaScript code) ...
});
$(document).ready(function() {
    // ... (Your existing JavaScript code) ...

    $('#registerForm').on('submit', function(event) {
        event.preventDefault();
        const name = $('#regName').val();
        const universityId = $('#regEmail').val();
        const password = $('#regPassword').val();
        const confirmPassword = $('#regConfirmPassword').val();

        if (password === confirmPassword) {
            alert('Registration successful (simulated)! You can now try to log in with these details.');
            $('#registerModal').modal('hide');
            // In a real app, you might clear the form here
        } else {
            alert('Registration failed: Passwords do not match.');
        }
    });

    // ... (Your existing JavaScript code) ...
});
var app = angular.module('libraryApp', []);

app.controller('LibraryController', function($scope, $http) {
    $scope.allBooks = [];    // All books from data.json
    $scope.displayedBooks = []; // Books currently shown
    $scope.booksPerPage = 3; // How many books to load at a time
    $scope.currentPage = 0;

    // Load all books initially
    $scope.loadBooks = function() {
        $http.get('data.json')
            .then(function(response) {
                $scope.allBooks = response.data.books;
                $scope.loadMore(); // Load first page
            })
            .catch(function(error) {
                console.error('Error loading books:', error);
            });
    };

    // Load More Books
    $scope.loadMore = function() {
        var start = $scope.currentPage * $scope.booksPerPage;
        var end = start + $scope.booksPerPage;
        var moreBooks = $scope.allBooks.slice(start, end);
        $scope.displayedBooks = $scope.displayedBooks.concat(moreBooks);
        $scope.currentPage++;

        // Hide Load More button if all books are loaded
        if ($scope.displayedBooks.length >= $scope.allBooks.length) {
            $scope.allBooksFullyLoaded = true;
        }
    };

    // View Book Details
    $scope.viewDetails = function(book) {
        alert('Title: ' + book.title + '\nAuthor: ' + book.author);
    };

    $scope.loadBooks(); // Auto-load when page starts
});
