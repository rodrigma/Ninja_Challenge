import { fixture, Selector, t, test } from "testcafe";
import {
  get_api_devices,
  get_ui_devices,
  compare_ui_vs_api_devices,
  validate_edit_remove_buttons,
} from "../pages/actions/actions";
const { LandingPage } = require("../pages/locators/LandingPage");
const dataSet = require('./data.json');
fixture("Challenge").page("http://localhost:3001/");

// Tests
test("Test 1", async (t) => {
  let map_api_devices = await get_api_devices(t);
  let map_ui_devices = await get_ui_devices();
  await compare_ui_vs_api_devices(map_api_devices, map_ui_devices, t);
  await validate_edit_remove_buttons(t);
});

dataSet.forEach((data) => {
  test("Test 2", async (t) => {
    const lp = new LandingPage(t);
    const system_name = data.system_name;
    const type = data.type;
    const capacity = data.capacity;
    await t.click(lp.btn_submit);
    await t.typeText(lp.input_system_name, data.system_name);
    let select_type = lp.select_type;
    let option_type = select_type.find("option");
    await t.click(select_type).click(option_type.withText(type));
    await t.typeText(lp.input_capacity, capacity);
    await t.click(lp.btn_update);

    let map_ui_devices = get_ui_devices();

    if ((await map_ui_devices).has(data.system_name)) {
      const device_info = (await map_ui_devices).get(data.system_name);
      let ui_name = device_info.nth(0);
      let ui_type = device_info.nth(1);
      let ui_capacity = device_info.nth(2);
      let isCorrect = false;

      if (system_name === ui_name) {
        if (type === ui_type) {
          if (capacity === ui_capacity) {
            isCorrect = true;
          }
        }
      }
      t.expect(true).eql(isCorrect);
    }
  });
});

test("Test 3", async (t) => {
  let id_device: String;
  let href = await Selector("div.list-devices div.device-main-box")
    .nth(0)
    .child("div.device-options")
    .child("a.device-edit")
    .getAttribute("href");

  if (href) {
    id_device = href.split("/")[3];
    const resp = await t.request.put({
      url: "http://localhost:3000/devices/" + id_device,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        id: id_device,
        system_name: "Rename Device",
        type: "WINDOWS",
        hdd_capacity: "10",
      },
    });
    //console.log(resp.status.valueOf());
    //console.log(resp.body.valueOf());
  }

  await t.eval(() => location.reload());
  await t.wait(3000);

  const map_devices = await get_ui_devices();

  await t.expect(true).eql(map_devices.has("Rename Device"));
});

test("Test 4", async (t) => {
  let id_device: String;
  let count = await Selector("div.list-devices div.device-main-box").count;
  const element = await Selector("div.list-devices div.device-main-box");
  const href = await element
    .nth(count - 1)
    .child("div.device-options")
    .child("a.device-edit")
    .getAttribute("href");

  if (href) {
    id_device = href.split("/")[3];
    const resp = await t.request.delete({
      url: "http://localhost:3000/devices/" + id_device,
    });
    await t.eval(() => location.reload());
    await t.wait(3000);

    const last_element_count = await element
      .child("div.device-options")
      .child("a.device-edit[href~='" + id_device + "']").count;
    //console.log(last_element_count);

    await t.expect(0).eql(last_element_count);
  }
});
