

export const OrderSummaryCard = ({ cart, total }) => {
  return (
    
      
        Order Summary
        
        {/* Product Cards */}
        
          {cart.map((item) => (
            

        {/* Total */}
        
          
            Total Amount
            ₹{total}
          
        
      
    
  );
};
