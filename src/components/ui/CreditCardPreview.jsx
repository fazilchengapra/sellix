
export const CreditCardPreview = ({
  cardNumber,
  cardName,
  expiry,
  cvv,
  isFlipped = false
}) => {
  const formatCardNumberDisplay = (number) => {
    if (!number) return '•••• •••• •••• ••••';
    const padded = number.padEnd(16, '•');
    return padded.match(/.{1,4}/g)?.join(' ') || '•••• •••• •••• ••••';
  };

  return (
    
      
                  
                
              
            

            
              
                {formatCardNumberDisplay(cardNumber)}
              

              
                
                  Cardholder
                  
                    {cardName || 'YOUR NAME'}
                  
                
                
                  Expires
                  
                    {expiry || 'MM/YY'}
                  
                
              
            
          
        

        {/* Back of Card */}
        
          
            {/* Magnetic Strip */}
            

            {/* CVV Section */}
            
              
                
                  {cvv || '•••'}
                
              
            

            {/* Card Info */}
            
              
                This card is property of the cardholder. Misuse is criminal offense.
              
            
          
        
      

      
    
  );
};
