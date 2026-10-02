// IELTS Writing question bank. All data is invented for practice purposes.

const TASK1_QUESTIONS = [
  {
    id: 't1-bar-internet',
    instruction: 'The bar chart below shows the percentage of households with internet access in four countries in 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    render: () => groupedBarChart({
      categories: ['UK', 'USA', 'Japan', 'Brazil'],
      series: [
        { name: '2000', values: [28, 35, 30, 5] },
        { name: '2020', values: [96, 90, 93, 74] },
      ],
      unit: '% of households',
      max: 100,
    }),
  },
  {
    id: 't1-line-tourists',
    instruction: 'The line graph below shows the number of international tourists (in millions) visiting three European countries between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    render: () => multiLineChart({
      categories: ['2000', '2005', '2010', '2015', '2020'],
      series: [
        { name: 'France', values: [77, 76, 77, 84, 42] },
        { name: 'Spain', values: [47, 55, 52, 68, 19] },
        { name: 'Italy', values: [41, 36, 43, 50, 25] },
      ],
      unit: 'million visitors',
    }),
  },
  {
    id: 't1-pie-energy',
    instruction: 'The pie charts below show the proportions of electricity production by source in Country X in 1990 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    render: () => pieChartPair({
      left: { title: '1990', data: [
        { label: 'Coal', value: 55 }, { label: 'Gas', value: 20 },
        { label: 'Nuclear', value: 20 }, { label: 'Renewable', value: 5 },
      ] },
      right: { title: '2020', data: [
        { label: 'Coal', value: 15 }, { label: 'Gas', value: 30 },
        { label: 'Nuclear', value: 20 }, { label: 'Renewable', value: 35 },
      ] },
    }),
  },
  {
    id: 't1-table-spending',
    instruction: 'The table below shows average monthly household spending (in USD) on three categories across four age groups in 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    render: () => dataTable({
      headers: ['Age group', 'Food', 'Transport', 'Entertainment'],
      rows: [
        ['18–29', '320', '180', '150'],
        ['30–44', '450', '260', '110'],
        ['45–59', '480', '220', '90'],
        ['60+', '350', '140', '70'],
      ],
    }),
  },
  {
    id: 't1-process-paper',
    instruction: 'The diagram below shows the process of making paper from trees. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    render: () => processFlow(['Harvest trees', 'Remove bark', 'Chip into pieces', 'Pulping', 'Bleaching', 'Press & dry', 'Roll into paper']),
  },
];

const TASK2_QUESTIONS = [
  {
    id: 't2-opinion-tech',
    type: 'Opinion (Agree/Disagree)',
    instruction: 'Some people believe that technology has made our lives too complicated, while others think it has made life simpler and more convenient. Discuss both views and give your own opinion.',
  },
  {
    id: 't2-discussion-education',
    type: 'Discussion',
    instruction: 'Some people think that university students should pay all the costs of their studies because university education benefits the individual student the most. To what extent do you agree or disagree?',
  },
  {
    id: 't2-problem-solution-traffic',
    type: 'Problem & Solution',
    instruction: 'Traffic congestion is becoming a serious problem in many major cities. What are the causes of this problem, and what measures could be taken to solve it?',
  },
  {
    id: 't2-adv-disadv-remote',
    type: 'Advantages & Disadvantages',
    instruction: 'An increasing number of people now work from home instead of commuting to an office. What are the advantages and disadvantages of this trend?',
  },
  {
    id: 't2-two-part-environment',
    type: 'Two-part Question',
    instruction: 'Many countries are experiencing a rapid increase in the amount of waste produced by households. Why is this happening, and what can governments do to reduce household waste?',
  },
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
