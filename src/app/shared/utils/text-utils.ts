export class TextUtils {
    static toVnd(amount: number, currency = 'VNĐ'): string {
        return amount.toLocaleString('vi-VN') + ' ' + currency;
      }
    
}