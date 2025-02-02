require 'rails_helper'

RSpec.describe "recipes/edit", type: :view do
  let(:recipe) {
    Recipe.create!(
      title: "MyString",
      description: "MyText"
    )
  }

  before(:each) do
    assign(:recipe, recipe)
  end

  it "renders the edit recipe form" do
    render

    assert_select "form[action=?][method=?]", recipe_path(recipe), "post" do

      assert_select "input[name=?]", "recipe[title]"

      assert_select "textarea[name=?]", "recipe[description]"
    end
  end
end
