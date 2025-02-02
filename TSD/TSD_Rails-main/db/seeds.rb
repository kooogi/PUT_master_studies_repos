# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

user = User.create(email: "user@example.com", password: "password", password_confirmation: "password")

Recipe.create(title: "Pancakes", description: "Delicious pancakes", creator: user)
Recipe.create(title: "Pasta", description: "Delicious pasta", creator: user)
Recipe.create(title: "Pizza", description: "Delicious pizza", creator: user)