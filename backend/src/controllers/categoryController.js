const { Category } = require("../models");

// カテゴリ一覧取得
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
};

// カテゴリ作成
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "カテゴリ名を入力してください" });
    }

    // 同じ名前のカテゴリが存在するか確認
    const existingCategory = await Category.findOne({
      where: { name, userId: req.user.id },
    });

    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "このカテゴリ名は既に存在します" });
    }

    const category = await Category.create({
      name,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "カテゴリを作成しました",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
};

// カテゴリ更新
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "カテゴリ名を入力してください" });
    }

    const category = await Category.findOne({
      where: { id, userId: req.user.id },
    });

    if (!category) {
      return res.status(404).json({ message: "カテゴリが見つかりません" });
    }

    // 同じ名前のカテゴリが存在するか確認（自分以外）
    const existingCategory = await Category.findOne({
      where: { name, userId: req.user.id },
    });

    if (existingCategory && existingCategory.id !== parseInt(id)) {
      return res
        .status(400)
        .json({ message: "このカテゴリ名は既に存在します" });
    }

    category.name = name;
    await category.save();

    res.json({
      message: "カテゴリを更新しました",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
};

// カテゴリ削除
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      where: { id, userId: req.user.id },
    });

    if (!category) {
      return res.status(404).json({ message: "カテゴリが見つかりません" });
    }

    await category.destroy();

    res.json({ message: "カテゴリを削除しました" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
};
