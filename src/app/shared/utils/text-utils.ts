export class TextUtils {
    static toVnd(amount: number, currency = 'VNĐ'): string {
        return amount.toLocaleString('vi-VN') + ' ' + currency;
      }

    static toPercentage(percentage: number): string {
        return (percentage * 100).toLocaleString('vi-VN') + '%';
    }
    
}