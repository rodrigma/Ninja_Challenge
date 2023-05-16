import { fixture, Selector, t, test } from "testcafe";
import {
    getAPIDevi,
    getUIDevices,
    compareUIAPIDevices,
    validateEditRemoveButtons,
    renameSystem,
    deleteRegister,
} from "../pages/actions/actions";
const { LandingPage } = require("../pages/locators/LandingPage");
const dataSet = require("./data.json");
fixture("Challenge").page("http://localhost:3001/");

// Tests
test("Test 1", async (t) => {
  let mapAPIDevices = await getAPIDevi(t);
  let mapUIDevices = await getUIDevices();
  await compareUIAPIDevices(mapAPIDevices, mapUIDevices, t);
  await validateEditRemoveButtons(t);
});

dataSet.forEach((data) => {
  test("Test 2", async (t) => {
    const lp = new LandingPage(t);
    const systemName = data.systemName;
    const type = data.type;
    const capacity = data.capacity;
    await t.click(lp.btnSubmit);
    await t.typeText(lp.inputSystemName, data.systemName);
    let selectType = lp.selectType;
    let option_type = selectType.find("option");
    await t.click(selectType).click(option_type.withText(type));
    await t.typeText(lp.inputCapacity, capacity);
    await t.click(lp.btnUpdate);

    let mapUIDevices = getUIDevices();

    if ((await mapUIDevices).has(data.systemName)) {
      const deviceInfo = (await mapUIDevices).get(data.systemName);
      let uiName = deviceInfo[0];
      let uiType = deviceInfo[1];
      if(uiType==="WINDOWS_SERVER"){
        uiType = uiType.replace("_"," ");
      }
      let uiCapacity = deviceInfo[2];
      let isCorrect = false;

      if (systemName === uiName) {
        if (type === uiType) {
          if (capacity === uiCapacity.replace(' GB','')) {
            isCorrect = true;
          }
        }
      }
      await t.expect(true).eql(isCorrect);
    }
  });
});

test("Test 3", async (t) => {
  let idDevice: String;
  let href = await Selector("div.list-devices div.device-main-box")
    .nth(0)
    .child("div.device-options")
    .child("a.device-edit")
    .getAttribute("href");

  if (href) {
    idDevice = href.split("/")[3];
    const resp = renameSystem(t, idDevice);
  }

  await t.eval(() => location.reload());
  await t.wait(3000);

  const mapDevices = await getUIDevices();

  await t.expect(true).eql(mapDevices.has("Rename Device"));
});

test("Test 4", async (t) => {
  let idDevice: String;
  let count = await Selector("div.list-devices div.device-main-box").count;
  const element = Selector("div.list-devices div.device-main-box");
  const href = await element
    .nth(count - 1)
    .child("div.device-options")
    .child("a.device-edit")
    .getAttribute("href");

  if (href) {
    idDevice = href.split("/")[3];
    renameSystem(t, idDevice);
    await t.eval(() => location.reload());
    await t.wait(3000);
    const lastElementCount = await element
      .child("div.device-options")
      .child("a.device-edit[href~='" + idDevice + "']").count;
    //console.log(lastElementCount);

    await t.expect(0).eql(lastElementCount);
  }
});
