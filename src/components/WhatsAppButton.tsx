'use client';

import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '213794662117';
    
    return (
        <>
            <style jsx global>{`
                @keyframes whatsapp-pulse {
                    0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); }
                    70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
                }
                .wa-btn {
                    animation: whatsapp-pulse 2s infinite;
                    background: #25D366;
                    color: white;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    display: flex;
                    alignItems: center;
                    justifyContent: center;
                    cursor: pointer;
                    border: none;
                    boxShadow: 0 4px 15px rgba(0,0,0,0.3);
                    z-index: 9999;
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                }
            `}</style>
            
            <a 
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-btn"
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    zIndex: 9999
                }}
            >
                <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.437 2.503 1.184 3.474l-.767 2.81 2.877-.754a5.727 5.727 0 0 0 2.474.571h.001c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.768-5.766m0 10.655a4.85 4.85 0 0 1-2.454-.664l-.175-.104-1.824.477.486-1.78-.115-.183a4.861 4.861 0 0 1-.741-2.63c0-2.683 2.183-4.866 4.865-4.866 2.682 0 4.865 2.183 4.865 4.866 0 2.682-2.183 4.865-4.865 4.865m3.541-4.833c-.194-.097-1.147-.567-1.326-.632-.178-.065-.308-.097-.437.097-.129.194-.502.632-.615.761-.113.13-.227.146-.421.049-.194-.097-.819-.302-1.56-.963-.577-.515-.966-1.152-1.079-1.346-.113-.194-.012-.299.085-.396.087-.087.194-.227.291-.34.097-.113.129-.194.194-.324.065-.13.032-.243-.016-.34-.049-.097-.437-1.053-.599-1.441-.158-.379-.333-.327-.458-.333-.117-.006-.252-.007-.387-.007-.135 0-.356.05-.542.253-.187.203-.712.697-.712 1.7s.731 1.976.833 2.114c.102.138 1.44 2.199 3.489 3.085.488.21 0.868.337 1.165.431.49.155.936.133 1.288.08.393-.059 1.147-.469 1.309-.923.162-.454.162-.843.113-.923-.049-.081-.178-.129-.372-.227z"/>
                </svg>
            </a>
        </>
    );
}
