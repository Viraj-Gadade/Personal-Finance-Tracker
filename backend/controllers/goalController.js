import Goal from "../models/Goal.js";

export const getGoals = async (req, res) => {
  try {
    let goals = await Goal.findOne({ userId: req.user.id });

    if (!goals) {
      goals = await Goal.create({
        userId: req.user.id,
        savingsGoal: 1000,
        expenseGoals: {
          food: 300,
          shopping: 150,
        },
      });
    }

    res.status(200).json(goals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateGoals = async (req, res) => {
  try {
    const { savingsGoal, expenseGoals } = req.body;

    const updatedGoals = await Goal.findOneAndUpdate(
      { userId: req.user.id },
      { savingsGoal, expenseGoals },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(updatedGoals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
