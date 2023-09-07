import { requestAmikomOne } from '$Amikom/Supports/request'
import Tokenizer from '../Supports/Tokenizer'
import type { IHistory, ITicketCost, ResponsePage } from '../typings/Response'

export default {
  TicketCost: async (
    bearerToken: string,
    xApiKey: string
  ): Promise<ITicketCost[]> => {
    const response: ResponsePage<ITicketCost[]> = await requestAmikomOne
      .get(
        `https://ds.amikom.ac.id/api/amikomone/payment/${Tokenizer(bearerToken).npm
        }/biaya_tiket`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'X-Api-Key': xApiKey
          }
        }
      )
      .json()
    return response.results
  },

  TicketHistory: (bearerToken: string, xApiKey: string) =>
    requestAmikomOne
      .get(
        `https://ds.amikom.ac.id/api/amikomone/payment/${Tokenizer(bearerToken).npm
        }/histori_tiket`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'X-Api-Key': xApiKey
          }
        }
      )
      .json(),
  /**
   * Histori Pembayaran semasa Kuliah
   */
  History: async (
    bearerToken: string,
    xApiKey: string
  ): Promise<IHistory[]> => {
    const response: ResponsePage<IHistory[]> = await requestAmikomOne
      .get(
        `https://ds.amikom.ac.id/api/amikomone/payment/${Tokenizer(bearerToken).npm
        }/histori`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'X-Api-Key': xApiKey
          }
        }
      )
      .json()
    return response.results
  },

  Bill: (bearerToken: string, xApiKey: string) =>
    requestAmikomOne
      .get(
        `https://ds.amikom.ac.id/api/amikomone/payment/${Tokenizer(bearerToken).npm
        }/tagihan`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'X-Api-Key': xApiKey
          }
        }
      )
      .json(),

  Payment: (bearerToken: string) =>
    requestAmikomOne
      .get('https://ds.amikom.ac.id/api/amikomone/payment', {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      })
      .json(),
  /**
   * Daftar bank AMIKOM
   */
  Bank: async (bearerToken: string): Promise<string[]> => {
    const response: ResponsePage<string[]> = await requestAmikomOne
      .get('https://ds.amikom.ac.id/api/amikomone/bank', {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      })
      .json()
    return response.results
  }
}
