import React from 'react';

interface ReceiptProps {
    sale: {
        cashierName: string;
        subTotal: string | number;
        discount: string | number;
        totalAmount: string | number;
        date: string;
        amountPaid?: string | number;
        change?: string | number;
    };
    cartItems: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
}

const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(({ sale, cartItems }, ref) => {
    // 1. Safely convert strings to numbers to avoid NaN errors
    const subTotal = Number(sale.subTotal) || 0;
    const discount = Number(sale.discount) || 0;
    const totalAmount = Number(sale.totalAmount) || 0;
    const amountPaid = Number(sale.amountPaid) || 0;
    const change = Number(sale.change) || 0;

    // 2. Calculate remaining balance
    const remainingAmount = totalAmount - amountPaid;

    // 3. Determine if this is a credit sale (Debt exists)
    // We use 0.01 to handle tiny floating point differences
    const isCreditSale = remainingAmount > 0.01;

    return (
        <div ref={ref} className="printable-receipt p-5 bg-white text-black font-mono text-[13px] w-[80mm]">
            <style jsx global>{`
                @media print {
                    body * { visibility: hidden; }
                    .printable-receipt, .printable-receipt * { visibility: visible; }
                    .printable-receipt {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 80mm;
                        padding: 5mm;
                    }
                    @page { margin: 0; size: 80mm auto; }
                }
            `}</style>

            <div className="text-center mb-4">
                <h2 className="text-xl font-bold mb-2">New Patisse</h2>
                <p className="text-[11px] my-1 text-[#333]">33 B LOT RIAD SALAM BD MOHAMMAD 6 MOHAMMEDIA</p>
                <p className="text-[11px] my-1 text-[#333]">Tel: +212 662-394164</p>
                <p className="text-[11px] my-1 text-[#333]">Date: {sale.date}</p>
                <p className="text-[11px] my-1 text-[#333]">Cashier: {sale.cashierName}</p>
            </div>

            <hr className="border-none border-t border-dashed border-[#999] my-3" />

            <table className="w-full border-collapse my-3">
                <thead>
                    <tr>
                        <th className="text-left py-1 border-b border-[#333] font-bold text-[11px]">Item</th>
                        <th className="text-center py-1 border-b border-[#333] font-bold text-[11px]">Qty</th>
                        <th className="text-right py-1 border-b border-[#333] font-bold text-[11px]">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item, index) => (
                        <tr key={index}>
                            <td className="py-1 text-[11px]">{item.name}</td>
                            <td className="text-center py-1 text-[11px]">{item.quantity}</td>
                            <td className="text-right py-1 text-[11px]">{Number(item.price).toFixed(2)} MAD</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <hr className="border-none border-t border-dashed border-[#999] my-3" />

            <div className="my-4">
                <div className="flex justify-between py-1 text-[12px]">
                    <span>Subtotal:</span>
                    <span>{subTotal.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between py-1 text-[12px]">
                    <span>Discount:</span>
                    <span>{discount.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between py-1 text-[14px] font-bold mt-2 pt-2 border-t border-[#333]">
                    <span>Total:</span>
                    <span>{totalAmount.toFixed(2)} MAD</span>
                </div>

                {/* Always show Amount Paid (Deposit or Full) */}
                <div className="flex justify-between py-1 text-[12px] mt-1">
                    <span>{isCreditSale ? "Paid / Deposit:" : "Amount Paid:"}</span>
                    <span>{amountPaid.toFixed(2)} MAD</span>
                </div>

                {/* CONDITIONAL LOGIC */}
                {isCreditSale ? (
                    /* Logic for Premium Client (Credit) */
                    <div className="flex justify-between py-1 text-[12px] font-bold border-t border-dashed border-[#999] mt-1 pt-1">
                        <span>Remaining Due:</span>
                        <span>{remainingAmount.toFixed(2)} MAD</span>
                    </div>
                ) : (
                    /* Logic for Normal Cashier (Change) */
                    <div className="flex justify-between py-1 text-[12px]">
                        <span>Change:</span>
                        <span>{change.toFixed(2)} MAD</span>
                    </div>
                )}
            </div>

            <div className="text-center mt-4 text-[11px]">
                <p className="my-1">Thank you for your visit!</p>
            </div>
        </div>
    );
});

Receipt.displayName = 'Receipt';

export default Receipt;