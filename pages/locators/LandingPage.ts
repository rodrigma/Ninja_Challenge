import { Selector } from "testcafe";

class LandingPage {
  btn_submit: Selector;
  input_system_name: Selector;
  input_type: Selector;
  select_type: Selector;
  input_capacity: Selector;
    btn_update: Selector;

  constructor(t: TestController) {
    this.btn_submit = Selector("a.submitButton");
    this.input_system_name = Selector("input#system_name");
    this.select_type = Selector("select#type");
    this.input_capacity = Selector("input#hdd_capacity");
    this.btn_update = Selector("button.submitButton");
  }
}
module.exports = {LandingPage};
