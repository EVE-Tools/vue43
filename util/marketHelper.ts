import { Order } from '../store/modules/markets'

/**
 * Calculates top ask/bid for a given list of orders. Orders sould be of the same region/type.
 * @param orders Orders to be analyzed
 */
export function getTopPrices (orders: Order[]) {
  const result = {
    topBid: -1,
    topAsk: -1
  }
  // Get top bid/ask
  for (let order of orders) {
    if (order.is_buy_order) {
      // Bid
      if (result.topBid === -1) {
        result.topBid = order.price
      } else if (order.price > result.topBid) {
        result.topBid = order.price
      }
    } else {
      // Ask
      if (result.topAsk === -1) {
        result.topAsk = order.price
      } else if (order.price < result.topAsk) {
        result.topAsk = order.price
      }
    }
  }

  return result
}
