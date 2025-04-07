
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/batches', { replace: true });
  }, [navigate]);
  
  return null;
};

export default ProductRedirect;
