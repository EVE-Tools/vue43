/*
  This file contains various helpers for dealing with historic OHLC data from external APIs and preparing it for display.
*/

import _ from 'lodash'

/** Convert history data into Highstock series format */
export let parseHistorySeries = function (data) {
  return _.sortBy(data, function (point) {
    return point.date
  }).map((point) => {
    const dateParsed = Date.parse(point.date)
    return [dateParsed, point.average]
  })
}

/** Calculate EVE-style metrics from OHLC data (used in the graph components) */
export let parseHistoryData = function (data) {
  var average,
    count,
    dateParsed,
    donchian,
    i,
    len,
    movingAverageWeek,
    orderCount,
    point,
    volume

  donchian = []
  volume = []
  orderCount = []
  average = []
  movingAverageWeek = []
  count = 0
  data = _.sortBy(data, function (point) {
    return point.date
  })
  for (i = 0, len = data.length; i < len; i++) {
    point = data[i]
    dateParsed = Date.parse(point.date)
    donchian[count] = [dateParsed, point.lowest, point.highest]
    volume[count] = [dateParsed, point.volume]
    orderCount[count] = [dateParsed, point.order_count]
    average[count] = [dateParsed, point.average]
    if (count >= 7) {
      let weeklyVolume = data.slice(count - 7, count).map(function (item) {
        return item.volume
      }).reduce(function (a, b) {
        return a + b
      })

      movingAverageWeek[count - 7] = [
        dateParsed, data.slice(count - 7, count).map(function (item) {
          return item.average * item.volume
        }).reduce(function (a, b) {
          return a + b
        }) / weeklyVolume
      ]
    }
    count++
  }
  return {
    donchian: donchian,
    volume: volume,
    orderCount: orderCount,
    average: average,
    movingAverageWeek: movingAverageWeek
  }
}

/** The theme for charts used on the site */
export let highchartsTheme = {
  colors: ['#33b5e5', '#50C878', '#FF0000', '#E68A17', '#333333'],
  chart: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 15,
    plotBackgroundColor: undefined,
    plotShadow: false,
    plotBorderWidth: 0
  },
  title: {
    style: {
      color: '#666'
    }
  },
  subtitle: {
    style: {
      color: '#666'
    }
  },
  xAxis: {
    gridLineWidth: 0,
    lineColor: '#333',
    tickColor: '#333',
    labels: {
      style: {
        color: '#666'
      }
    },
    title: {
      style: {
        color: '#666'
      }
    }
  },
  yAxis: {
    gridLineColor: 'rgba(255, 255, 255, .2)',
    lineWidth: 0,
    tickWidth: 0,
    labels: {
      style: {
        color: '#FFF',
        fontWeight: 'bold'
      }
    },
    title: {
      style: {
        color: '#AAA',
        font: 'bold 12px Helvetica, sans-serif'
      }
    }
  },
  legend: {
    itemStyle: {
      color: '#CCC'
    },
    itemHoverStyle: {
      color: '#FFF'
    },
    itemHiddenStyle: {
      color: '#333'
    }
  },
  labels: {
    style: {
      color: '#CCC'
    }
  },
  tooltip: {
    backgroundColor: 'rgba(16, 16, 16, .9)',
    borderWidth: 0,
    style: {
      color: '#FFF'
    }
  },
  plotOptions: {
    line: {
      dataLabels: {
        color: '#333'
      },
      marker: {
        lineColor: '#333'
      }
    },
    spline: {
      marker: {
        lineColor: '#333'
      }
    },
    scatter: {
      marker: {
        lineColor: '#333'
      }
    },
    candlestick: {
      lineColor: '#333'
    }
  },
  toolbar: {
    itemStyle: {
      color: '#CCC'
    }
  },
  navigation: {
    buttonOptions: {
      backgroundColor: '#606060',
      borderColor: '#000000',
      symbolStroke: '#C0C0C0',
      hoverSymbolStroke: '#FFFFFF'
    }
  },
  exporting: {
  },
  rangeSelector: {
    buttonTheme: {
      fill: '#333',
      stroke: '#333',
      style: {
        color: '#666'
      },
      states: {
        hover: {
          fill: '#333',
          stroke: '#000000',
          style: {
            color: 'white'
          }
        },
        select: {
          fill: '#444',
          stroke: '#000000',
          style: {
            color: '#6EA8E5'
          }
        }
      }
    },
    inputStyle: {
      backgroundColor: '#606060',
      color: '#333'
    },
    labelStyle: {
      color: '#333'
    }
  },
  navigator: {
    handles: {
      backgroundColor: '#666',
      borderColor: '#666'
    },
    outlineColor: '#666',
    maskFill: 'rgba(16, 16, 16, 0)',
    series: {
      color: '#7798BF',
      lineColor: '#333'
    }
  },
  scrollbar: {
    barBackgroundColor: '#333',
    barBorderColor: '#333',
    buttonArrowColor: '#333',
    buttonBackgroundColor: '#333',
    buttonBorderColor: '#333',
    rifleColor: '#333',
    trackBackgroundColor: '#333',
    trackBorderColor: '#333'
  },
  legendBackgroundColor: 'rgba(48, 48, 48, 0.8)',
  legendBackgroundColorSolid: 'rgb(70, 70, 70)',
  dataLabelsColor: '#333',
  textColor: '#666',
  maskColor: 'rgba(255,255,255,0.0)'
}
