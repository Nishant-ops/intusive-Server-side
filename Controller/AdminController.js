const UserModal = require("../Model/UserModel");

module.exports.getUsersCount = async function getUsersCount(req, res) {
  try {
    let DailyTime = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    let WeeklyTime = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
    let MonthlyTime = new Date(
      new Date().getTime() - 30 * 7 * 24 * 60 * 60 * 1000
    );
    // console.log(MonthlyTime.getTime());
    const DailyCount = await UserModal.countDocuments({
      lastActivityTime: { $gte: DailyTime.getTime() },
    });
    // console.log("came here", DailyCount);
    const WeeklyCount = await UserModal.countDocuments({
      lastActivityTime: { $gte: WeeklyTime.getTime() },
    });
    const MonthlyCount = await UserModal.countDocuments({
      lastActivityTime: { $gte: MonthlyTime.getTime() },
    });

    const data = [
      { daily: DailyCount, weekly: WeeklyCount, monthly: MonthlyCount },
    ];
    return res.status(200).json({
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
};
module.exports.getUsersOnUsageTime = async function getUserOnUsageTime(
  req,
  res
) {
  const data = req.body;
  const filterType = data.filterType;
  const filterData = data.filterValue;
  const filter = {};
  if (filterType.length > 0 && filterData.length > 0)
    filter[filterType] = filterData;
  // console.log(filter);/
  const users = await UserModal.find(filter)
    .select("name , email , totalActivityTime , id")
    .sort({ totalActivityTime: -1 })
    .limit(15);
  let response = [];
  // console.log(users);
  for (let index in users) {
    // console.log(users[index]);
    let currUser = {
      id: users[index].id,
      col1: users[index].name,
      col2: users[index].email,
      col3: users[index].totalActivityTime,
    };
    // console.log(user, currUser);
    response.push(currUser);
  }
  return res.json({
    users: response,
  });
};
