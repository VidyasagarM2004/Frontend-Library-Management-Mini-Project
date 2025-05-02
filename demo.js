var app = angular.module('libraryApp', []);

app.controller('LibraryController', function($scope, $http, $timeout) {
    $scope.books = [];
    $scope.displayedBooks = [];
    $scope.booksPerPage = 3;
    $scope.currentPage = 0;
    $scope.allBooksFullyLoaded = false;

    $scope.loginData = {};
    $scope.registerData = {};
    $scope.contact = {};

    // Load all books
    $scope.loadBooks = function() {
        $http.get('data.json')
            .then(function(response) {
                $scope.books = response.data.books;
                $scope.loadMore();
            })
            .catch(function(error) {
                console.error('Error loading books:', error);
            });
    };

    $scope.loadMore = function() {
        var start = $scope.currentPage * $scope.booksPerPage;
        var end = start + $scope.booksPerPage;
        var moreBooks = $scope.books.slice(start, end);
        $scope.displayedBooks = $scope.displayedBooks.concat(moreBooks);
        $scope.currentPage++;

        if ($scope.displayedBooks.length >= $scope.books.length) {
            $scope.allBooksFullyLoaded = true;
        }
    };

    $scope.viewDetails = function(book) {
        alert('Title: ' + book.title + '\nAuthor: ' + book.author);
    };

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

    $scope.register = function(newUser) {
        if (newUser.password !== newUser.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        $http.post('/api/register', newUser)
            .then(function(response) {
                alert('Registration successful!');
                $('#registerModal').modal('hide');
                $scope.registerData = {};
            })
            .catch(function(error) {
                console.error('Registration error:', error);
                alert('Registration successful.');
            });
    };

    $scope.search = function(searchTerm) {
        if (searchTerm) {
            alert('Searching for: ' + searchTerm);
        } else {
            alert('Please enter a search term!');
        }
    };

    $scope.sendContact = function(contact) {
        if (contact.name && contact.email && contact.subject && contact.message) {
            alert('Thank you for contacting us, ' + contact.name + '!');
        } else {
            alert('Please fill all contact fields.');
        }
    };

    // jQuery Integration (run once DOM is ready)
    angular.element(document).ready(function() {
        // Smooth Scroll
        $('a[href^="#"]').on('click', function(event) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: $($(this).attr('href')).offset().top - 70
            }, 800);
        });

        // Navbar scroll effect
        $(window).scroll(function() {
            if ($(this).scrollTop() > 50) {
                $('.navbar').addClass('navbar-scrolled');
            } else {
                $('.navbar').removeClass('navbar-scrolled');
            }
        });

        // Form submissions (handled by Angular, but fallback)
        $('#loginForm').on('submit', function(event) {
            event.preventDefault();
            $scope.login($scope.loginData);
        });

        $('#registerForm').on('submit', function(event) {
            event.preventDefault();
            $scope.register($scope.registerData);
        });

        $('#contactForm').on('submit', function(event) {
            event.preventDefault();
            $scope.sendContact($scope.contact);
        });

        // Book details handler (delegate to Angular function if needed)
        $(document).on('click', '.btn-outline-primary', function() {
            alert('Book details would be shown here (e.g., modal)');
        });

        // Search button click
        $('.search-box button').on('click', function() {
            const term = $('.search-box input').val().trim();
            $scope.$apply(() => $scope.search(term));
        });

        // "Load More" button click
        $('#loadMoreBooks').on('click', function() {
            $scope.$apply(() => $scope.loadMore());
            $(this).prop('disabled', true).text('Loading...');
            $timeout(() => {
                if (!$scope.allBooksFullyLoaded) {
                    $(this).prop('disabled', false).text('Load More Books');
                } else {
                    $(this).prop('disabled', true).text('No More Books');
                }
            }, 1500);
        });
    });

    // Initial call
    $scope.loadBooks();
});
