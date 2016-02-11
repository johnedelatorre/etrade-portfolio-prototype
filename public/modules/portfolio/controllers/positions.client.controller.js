'use strict';
angular.module('portfolio').controller('PositionsController', ['$scope',
    function($scope) {
	$scope.templates = [{
	    name: 'All Positions',
	    description: 'Columns specific for frequent check ups',
	    fields: ['lastTrade', 'changeClose', 'changeClosePercentage', 'quantity', 'pricePaidPerShare', 'dayGainDollar', 'dayGainPercent', 'totalGainDollar', 'totalGainPercent', 'value'],
	    type: 'default'
	}, {
	    name: 'Options',
	    description: 'Fields specific to your options holdings',
	    fields: ['delta', 'gamma', 'IVPercent', 'lastTrade', 'theta', 'vega', 'dayGainDollar','quantity','totalGainDollar','value'],
	    type: 'default'
	}, {
	    name: 'Mutual Funds',
	    description: 'Fields specific to your mutual fund holdings',
        fields: ['fundCategory', 'allStar', 'netAssetValue', 'quantity', 'ytdReturn','ytdReturnPercent','totalReturn','totalReturnPercent','value'],
	    type: 'default'
	}, {
	    name: 'Bonds',
	    description: 'Fields specific to your bonds holdings',
	    fields: ['type', 'coupon', 'description', 'maturity', 'rating','lastTrade','pricePaidPerShare','quantity'],
	    type: 'default'
	}];
	// , {
	//     name: 'Create New View',
	//     description: 'Create a new view by choosing which fields you prefer',
	//     fields: [],
	//     type: 'default'
	// }];
	$scope.config = {};
	$scope.config.defaultView = JSON.parse(localStorage.getItem('defaultView')) || 0;
	$scope.config.currentView = $scope.config.defaultView;
	$scope.views = JSON.parse(localStorage.getItem('PortfolioView2')) || $scope.templates;
	$scope.config.allOptions = {
	    fundCategory: {
		name: 'Fund Category',
		enabled: false,
		group: 'Mutual Funds',
		align: 'text-right',
		summable: false
	    },
	    morningStar: {
		name: 'Morningstar Rating',
		enabled: false,
		group: 'Mutual Funds',
		align: 'text-right',
		summable: false
	    },
	    netAssetValue: {
		name: 'Net Asset Value $',
		enabled: false,
		group: 'Mutual Funds',
		align: 'text-right',
		summable: false
	    },
	    netExpenseRatio: {
		name: 'Net Expense Ratio',
		enabled: false,
		group: 'Mutual Funds',
		align: 'text-right',
		summable: false
	    },
	    totalNetAssets: {
		name: 'Total Net Assets $',
		enabled: false,
		group: 'Mutual Funds',
		align: 'text-right',
		summable: false
	    },
	    allStar: {
		name: 'All-Star/NTF',
		enabled: false,
		group: 'Mutual Funds',
		align: 'text-right',
		summable: false
	    },
	    percentOfPortfolio: {
		name: '% of Portfolio',
		enabled: true,
		group: 'Other',
		align: 'text-right',
		summable: false
	    },
	    range: {
		name: '52 Week Range $',
		enabled: false,
		group: 'Other',
		align: 'text-right',
		summable: false
	    },
	    ask: {
		name: 'Ask & Ask (Size)',
		enabled: false,
		group: 'Other',
		align: 'text-right',
		summable: false
	    },
	    bid: {
		name: 'Bid & Bid (Size)',
		enabled: false,
		group: 'Other',
		align: 'text-right',
		summable: false
	    },
	    changeClose: {
		name: 'Change $',
		enabled: false,
		group: 'Performance',
		align: 'text-right',
		summable: false
	    },
	    changeClosePercentage: {
		name: 'Change %',
		enabled: false,
		group: 'Performance',
		align: 'text-right',
		summable: false
	    },
	    daysRange: {
		name: 'Day\'s Range $',
		enabled: false,
		group: 'Other',
		align: 'text-right',
		summable: false
	    },
	    description: {
		name: 'Description',
		enabled: false,
		group: 'Bonds',
		align: 'text-right',
		summable: false
	    },
	    maturity: {
		name: 'Maturity',
		enabled: false,
		group: 'Bonds',
		align: 'text-right',
		summable: false
	    },
	    rating: {
		name: 'S&P Rating',
		enabled: false,
		group: 'Bonds',
		align: 'text-right',
		summable: false
	    },
	    earningsDate: {
		name: 'Next Earnings Date',
		enabled: false,
		group: 'Other',
		align: 'text-right',
		summable: false
	    },
	    earningsPerShare: {
		name: 'Earnings Per Share',
		enabled: false,
		group: 'Other',
		align: 'text-right',
		summable: false
	    },
	    lastTrade: {
		name: 'Last Price $',
		enabled: false,
		group: 'Performance',
		align: 'text-right',
		summable: false,
		changeFormat: 'none',
		type: 'none'
	    },
	    // marketCap: {
	    //     name: 'Market Cap',
	    //     enabled: false,
	    //     group: 'Market',
	    //     align: 'text-right',
	    //     summable: false
	    // },
	    open: {
		name: 'Open $',
		enabled: false,
		group: 'Other',
		align: 'text-right',
		summable: false
	    },
	    // PERatio: {
	    //     name: 'P/E Ratio',
	    //     enabled: false,
	    //     group: 'Market',
	    //     align: 'text-right',
	    //     summable: false
	    // },
	    previousClose: {
		name: 'Previous Close $',
		enabled: false,
		group: 'Other',
		align: 'text-right',
		summable: false
	    },
	    // price: {
	    //     name: 'Price $',
	    //     enabled: false,
	    //     group: 'Performance',
	    //     align: 'text-right',
	    //     summable: false
	    // },
	    type: {
		name: 'Bond Type',
		enabled: false,
		group: 'Bonds',
		align: 'text-right',
		summable: false
	    },
	    coupon: {
		name: 'Coupon',
		enabled: false,
		group: 'Bonds',
		align: 'text-right',
		summable: false
	    },
	    volume: {
		name: 'Volume',
		enabled: false,
		group: 'Other',
		align: 'text-right',
		summable: false
	    },
	    // commissions: {
	    //     name: 'Commissions',
	    //     enabled: false,
	    //     group: 'Transaction',
	    //     align: 'text-right',
	    //     summable: false
	    // },
	    // dateAcquired: {
	    //     name: 'Date Acquired',
	    //     enabled: false,
	    //     group: 'Transaction',
	    //     align: 'text-right',
	    //     summable: false
	    // },
	    //    daysGain: {
	    // name: 'Day\'s Gain ($/%)',
	    // enabled: false,
	    // group: 'Transaction',
	    // align: 'text-right',
	    // summable: false
	    //    },
	    dayGainDollar: {
		name: 'Day\'s Gain $',
		enabled: false,
		type: 'dollar',
		group: 'Performance',
		align: 'text-right',
		summable: true
	    },
	    dayGainPercent: {
		name: 'Day\'s Gain %',
		enabled: false,
		type: 'percent',
		group: 'Performance',
		align: 'text-right',
		summable: true
	    },
	    dividend: {
		name: 'Next Dividend Date',
		enabled: false,
		group: 'Other',
		align: 'text-right',
		summable: false
	    },
	    dividendYield: {
		name: 'Distribution Yield',
		enabled: false,
		group: 'Mutual Funds',
		align: 'text-right',
		summable: false
	    },
	    // termLength: {
	    //     name: 'Long or Short',
	    //     enabled: false,
	    //     group: 'Transaction',
	    //     align: 'text-right',
	    //     summable: false
	    // },
	    marginDollar: {
		name: 'Margin Requirement $',
		enabled: false,
		group: 'Other',
		align: 'text-right',
		summable: true
	    },
	    marginPercent: {
		name: 'Margin Requirement %',
		enabled: false,
		group: 'Other',
		align: 'text-right',
		summable: false
	    },
	    value: {
		name: 'Value $',
		enabled: false,
		type: 'uncolored dollar',
		group: 'Performance',
		align: 'text-right',
		changeFormat: 'uncolored',
		summable: true
	    },
	    pricePaid: {
		name: 'Total Price Paid $',
		enabled: false,
		group: 'Performance',
		align: 'text-right',
		summable: true,
		changeFormat: 'none',
		type: 'none'
	    },
	    pricePaidPerShare: {
		name: 'Price Paid $',
		enabled: false,
		group: 'Performance',
		align: 'text-right',
		summable: true,
		changeFormat: 'uncolored',
		type: 'uncolored dollar'
	    },
	    quantity: {
		name: 'Quantity #',
		enabled: false,
		group: 'Performance',
		align: 'text-right',
		changeFormat: 'none',
		summable: false
	    },
	    // term: {
	    //     name: 'Term',
	    //     enabled: false,
	    //     group: 'Transaction',
	    //     align: 'text-right',
	    //     summable: false
	    // },
	    // totalCost: {
	    //     name: 'Total Cost',
	    //     enabled: false,
	    //     group: 'Transaction',
	    //     align: 'text-right',
	    //     summable: false
	    // },
	    //    totalGain: {
	    // name: 'Total Gain ($/%)',
	    // enabled: false,
	    // group: 'Transaction',
	    // align: 'text-right',
	    // summable: false
	    //    },
	    totalGainDollar: {
		name: 'Total Gain $',
		enabled: false,
		type: 'dollar',
		group: 'Performance',
		align: 'text-right',
		summable: true
	    },
	    totalGainPercent: {
		name: 'Total Gain %',
		enabled: false,
		type: 'percent',
		group: 'Performance',
		align: 'text-right',
		summable: true
	    },
        totalReturn: {
            name: 'Total Return $',
            enabled: false,
            group: 'Transaction',
            align: 'text-right',
            summable: false
        },
        totalReturnPercent: {
            name: 'Total Return %',
            enabled: false,
            group: 'Transaction',
            align: 'text-right',
            summable: false
        },
        ytdReturn: {
            name: 'YTD Return $',
            enabled: false,
            group: 'Transaction',
            align: 'text-right',
            summable: false
        },
        ytdReturnPercent: {
            name: 'YTD Return %',
            enabled: false,
            group: 'Transaction',
            align: 'text-right',
            summable: false
        },
	    IVPercent: {
		name: 'IV%',
		enabled: false,
		group: 'Options',
		align: 'text-right',
		summable: false
	    },
	    delta: {
		name: 'Delta',
		enabled: false,
		group: 'Options',
		align: 'text-right',
		summable: false
	    },
	    gamma: {
		name: 'Gamma',
		enabled: false,
		group: 'Options',
		align: 'text-right',
		summable: false
	    },
	    vega: {
		name: 'Vega',
		enabled: false,
		group: 'Options',
		align: 'text-right',
		summable: false
	    },
	    theta: {
		name: 'Theta',
		enabled: false,
		group: 'Options',
		align: 'text-right',
		summable: false
	    },
	    // currency: {
	    //     name: 'Currency',
	    //     enabled: false,
	    //     group: 'Other',
	    //     align: 'text-right',
	    //     summable: false
	    // },
	    // deliverables: {
	    //     name: 'Deliverables',
	    //     enabled: false,
	    //     group: 'Other',
	    //     align: 'text-right',
	    //     summable: false
	    // },
	    // otherFees: {
	    //     name: 'Other Fees',
	    //     enabled: false,
	    //     group: 'Other',
	    //     align: 'text-right',
	    //     summable: false
	    // },
	    // heldAs: {
	    //     name: 'Held As',
	    //     enabled: false,
	    //     group: 'Other',
	    //     align: 'text-right',
	    //     summable: false
	    // }
	};
    }
]);
