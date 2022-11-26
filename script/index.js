#!/usr/bin/env zx
const fs = require("fs");
(async function () {
  await $`git fetch origin --prune`;
  const tags = await $`git tag -l --sort=taggerdate`;
  const packageStr = await fs.readFileSync(process.cwd() + "/package.json", {
    encoding: "utf8",
  });
  const packageJson = JSON.parse(packageStr);
  let newVersion = "";
  if (tags.stdout) {
    const tagList = tags.stdout.split("\n").filter((v) => v);
    const lastag = tagList.pop();
    if (lastag.includes("alpha")) {
      const lastVersionArr = lastag.split(".");
      const num = lastVersionArr.pop();
      lastVersionArr.push(Number(num) + 1);
      newVersion = lastVersionArr.join(".");
    } else {
      newVersion = lastag + "-alpha.0";
    }
  } else {
    newVersion = packageJson.version + "-alpha.0";
  }

  packageJson.version = newVersion;
  await fs.writeFileSync(
    `${process.cwd()}/package.json`,
    JSON.stringify(packageJson, "", 4)
  );
  try {
    await $`git tag ${newVersion} -m '[ci skip]:${newVersion}'`;
    await $`git push origin --tags --push-option=ci.skip`;
  } catch (error) {
    console.log(
      "%c 🍢 error: ",
      "font-size:20px;background-color: #33A5FF;color:#fff;",
      error
    );
    process.exit(1);
  }
})();
