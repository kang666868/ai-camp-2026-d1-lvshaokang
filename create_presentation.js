const pptxgen = require("C:/Users/吕绍康/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pptxgenjs");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "吕绍康 U202412686";
pptx.subject = "Day 1 Titanic classification";
pptx.title = "Day 1: Explain Titanic Prediction Errors";
pptx.lang = "zh-CN";
pptx.theme = { headFontFace: "Aptos Display", bodyFontFace: "Aptos", lang: "zh-CN" };

function slide(title, bullets) {
  const s = pptx.addSlide();
  s.background = { color: "F7FAFC" };
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 0.28, fill: { color: "0F766E" }, line: { color: "0F766E" } });
  s.addText(title, { x: 0.7, y: 0.7, w: 12, h: 0.5, fontSize: 25, bold: true, color: "12343B" });
  s.addText(bullets.map(text => ({ text, options: { bullet: { indent: 18 }, hanging: 3 } })), {
    x: 0.9, y: 1.55, w: 11.6, h: 5.1, fontSize: 18, color: "20343A", breakLine: true,
    paraSpaceAfterPt: 14, valign: "mid"
  });
  s.addText("Day 1 | 吕绍康 U202412686", { x: 0.7, y: 7.05, w: 6, h: 0.25, fontSize: 9, color: "64748B" });
}

slide("问题与使用者（约 30 秒）", [
  "使用者：准备历史展览、需要解释数据和模型局限的博物馆教育团队。",
  "输入：Kaggle Titanic train.csv，891 行、12 列真实乘客记录。",
  "输出：多数类基线与随机森林在同一留出测试集上的指标，以及真实错误乘客。",
  "最重要错误：真实幸存却被预测为未幸存，即假阴性。"
]);
slide("方法与基线（约 45 秒）", [
  "固定 75/25 分层划分，随机种子 42；两个模型面对同一批 223 名测试乘客。",
  "预处理：数值列使用训练集的中位数填补；类别列使用众数填补并独热编码。",
  "基线：DummyClassifier(most_frequent)，永远猜训练集最多的类别。",
  "候选：相同预处理之后接 RandomForestClassifier(random_state=42)。"
]);
slide("最重要证据（约 60 秒）", [
  "数据检查通过：891 行；Age 缺失 177，Embarked 缺失 2；3 个测试全部通过。",
  "223 名留出乘客：accuracy 0.6143 到 0.7444；survivor recall 0 到 0.6279；F1 0 到 0.6545。",
  "混淆矩阵：[[137, 0], [86, 0]] 到 [[112, 25], [32, 54]]。",
  "假阴性从 86 人降到 32 人，因此候选模型更有用，但仍有明显错误。"
]);
slide("失败、限制与下一问题（约 45 秒）", [
  "真实假阴性：PassengerId 348，三等舱女性，年龄缺失、票价 16.1；实际幸存，预测未幸存。",
  "该错误说明模型会漏判个体；它不能证明某个字段造成了历史结果或精确导致模型判断。",
  "限制：单一历史数据集、一次固定划分、观察性数据，不用于现代救援。",
  "下一步：比较所有假阴性与真阳性在舱位、性别和年龄缺失上的分布。"
]);

pptx.writeFile({ fileName: "presentation.pptx" });
