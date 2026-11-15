/* Source: 财务数据修正说明与五年预测表（数据公式版）.doc.
 * Preserve rounded result tables; do not invent missing annual splits.
 */
window.FUYI_DATA = Object.freeze({
  years: ['第1年', '第2年', '第3年', '第4年', '第5年'],
  revenue: [6.8, 22, 53, 100, 168],
  cost: [3.7, 11.1, 24.5, 43.5, 70],
  grossProfit: [3.1, 10.9, 28.5, 56.5, 98],
  expenses: [10.5, 19.3, 26, 34.5, 46.5],
  team: [6, 12, 15, 18, 22],
  operatingProfit: [-7.4, -8.4, 2.5, 22, 51.5],
  tax: [0, 0, 0, .4, 2.6],
  netProfit: [-7.4, -8.4, 2.5, 21.6, 48.9],
  netMargin: [-108.8, -38.2, 4.7, 21.6, 29.1],
  workingCapitalIncrease: [.8, 1.4, 2.6, 3.4, 4.8],
  operatingCash: [-8.2, -9.8, -.1, 18.2, 44.1],
  investmentOutflow: [8.5, .5, .5, 1.5, 2],
  financingInflow: [20, 8, 0, 0, 0],
  cashStart: [0, 3.3, 1, .4, 17.1],
  cashEnd: [3.3, 1, .4, 17.1, 59.2],
  revenueMix: [
    { label: '产品销售', values: [4, 85], color: '#4e9b72' },
    { label: '订阅服务', values: [2, 60], color: '#735b91' },
    { label: 'B端机构服务', values: [.5, 18], color: '#d98c4a' },
    { label: '其他收入', values: [.3, 5], color: '#507e9d' }
  ],
  expenseEndpoints: { marketing: [2, 12], research: [1.5, 4.5], management: [1, 8] },
  laborSensitivity: { cost: [12, 15, 18, 21], monthlySalary: [2000, 2500, 3000, 3500], profit: [4.7, 2.5, -.5, -3.5] },
  userSensitivity: { achievement: [70, 85, 100], households: [2450, 2975, 3500], revenue: [117.6, 142.8, 168], profit: [21, 35, 48.9], payback: ['第6年', '第5年', '第5年'] },
  photos: [
    { file: 'activity-01.jpg', caption: '一把亲手做的扇子，一份看得见的欢喜。', alt: '老人微笑着展示亲手制作的彩色团扇' },
    { file: 'activity-02.jpg', caption: '把熟悉的手艺，变成日常的小小成就。', alt: '老人坐在活动桌旁展示彩色团扇作品' },
    { file: 'activity-03.jpg', caption: '有人耐心陪伴，每一步都可以慢慢来。', alt: '志愿者在老人身旁协助完成手工作品' },
    { file: 'activity-04.jpg', caption: '从动手制作，到自信地展示。', alt: '老人手持彩色手工作品面向镜头微笑' },
    { file: 'activity-05.jpg', caption: '让每一份创作，都有被欣赏的时刻。', alt: '老人微笑着举起圆形手工扇作品' },
    { file: 'activity-06.jpg', caption: '手把手的协作，让陪伴更加具体。', alt: '志愿者俯身与老人共同制作手工扇' },
    { file: 'activity-07.jpg', caption: '围坐在一起，让手艺连接彼此。', alt: '活动现场志愿者与老人围坐在桌旁制作手工艺品' }
  ]
});
