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
        // Ensure 'print:block' is here
        <div ref={ref} className="w-[80mm] p-4 font-mono text-sm text-black bg-white">
            <style jsx global>{`
                @media print {
                    /* 2. Make the Receipt Visible */
                    .print\\:block, .print\\:block * {
                        visibility: visible;
                        height: auto;
                        overflow: visible;
                    }

                    /* 3. Position the receipt at the top left of the paper */
                    .print\\:block {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 80mm;
                    }

                    /* 4. Reset page margins for thermal printer */
                    @page { margin: 0; size: 80mm auto; }
                }
            `}</style>

            <div className="text-center mb-4">
                <h1 className="text-xl font-bold mb-1">New Patisse</h1>
                <p className="text-xs">33 B LOT RIAD SALAM BD MOHAMMAD 6 MOHAMMEDIA</p>
                <p className="text-xs mt-1">Tel: +212 662-394164</p>
                <div className="mt-2 text-xs border-b border-dashed border-gray-400 pb-2">
                    <p>Date: {sale.date}</p>
                    <p>Caissier: {sale.cashierName}</p>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between font-bold border-b border-dashed border-gray-400 pb-1 mb-2">
                    <span className="w-1/2 text-left">Article</span>
                    <span className="w-1/4 text-center">Qté</span>
                    <span className="w-1/4 text-right">Prix</span>
                </div>
                {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between mb-1 text-xs">
                        <span className="w-1/2 text-left truncate pr-1">{item.name}</span>
                        <span className="w-1/4 text-center">{item.quantity}</span>
                        <span className="w-1/4 text-right">{Number(item.price).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <div className="border-t border-dashed border-gray-400 pt-2 mb-4">
                <div className="flex justify-between mb-1 text-xs">
                    <span>Sous-total:</span>
                    <span>{subTotal.toFixed(2)} DH</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between mb-1 text-xs">
                        <span>Remise:</span>
                        <span>-{discount.toFixed(2)} DH</span>
                    </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-dashed border-gray-400">
                    <span>Total:</span>
                    <span>{totalAmount.toFixed(2)} DH</span>
                </div>

                {/* Amount Paid Section */}
                <div className="flex justify-between mt-2 text-xs">
                    <span>{isCreditSale ? "Payé / Acompte:" : "Montant Payé:"}</span>
                    <span>{amountPaid.toFixed(2)} DH</span>
                </div>

                {/* Change or Remaining Section */}
                <div className="flex justify-between text-xs font-bold mt-1">
                    {isCreditSale ? (
                         <>
                            <span>Reste à Payer:</span>
                            <span>{remainingAmount.toFixed(2)} DH</span>
                         </>
                    ) : (
                        <>
                            <span>Monnaie:</span>
                            <span>{change.toFixed(2)} DH</span>
                        </>
                    )}
                </div>
            </div>

            <div className="text-center text-xs mt-6">
                <p className="my-1">Merci pour votre visite!</p>
                <p className="font-bold mb-2">Les articles vendus ne sont ni repris ni échangés</p>
            </div>
        </div>
    );
});

Receipt.displayName = 'Receipt';

export default Receipt;