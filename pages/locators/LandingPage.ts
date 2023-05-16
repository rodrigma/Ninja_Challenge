import { Selector } from "testcafe";

class LandingPage {
  btnSubmit: Selector;
  inputSystemName: Selector;
  inputType: Selector;
  selectType: Selector;
  inputCapacity: Selector;
    btnUpdate: Selector;

  constructor(t: TestController) {
    this.btnSubmit = Selector("a.submitButton");
    this.inputSystemName = Selector("input#system_name");
    this.selectType = Selector("select#type");
    this.inputCapacity = Selector("input#hdd_capacity");
    this.btnUpdate = Selector("button.submitButton");
  }
}
module.exports = {LandingPage};
