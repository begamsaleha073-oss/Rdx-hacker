const fetch = require('node-fetch');

const API_KEY = 'vishalboss_7e7e8e674cdbd54e3fd0';

module.exports = async (req, res) => {
  // SECURITY: Check if request is from browser directly
  const userAgent = req.headers['user-agent'] || '';
  const referer = req.headers['referer'] || '';
  const isBrowser = userAgent.includes('Mozilla') || 
                    userAgent.includes('Chrome') || 
                    userAgent.includes('Safari') ||
                    userAgent.includes('Firefox') ||
                    userAgent.includes('Edge');

  // If someone tries to access API directly from browser without coming from our website
  if (isBrowser && !referer.includes('https://rdx-hacker-teal.vercel.app')) {
    
    // HTML page with redirect message
    const redirectHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>🚫 Access Blocked - Happy Info Tool</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          background: #000;
          color: #00fff2;
          font-family: 'Courier New', monospace;
          text-align: center;
          padding: 50px;
          margin: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          border: 2px solid #00fff2;
          border-radius: 10px;
          padding: 30px;
          background: rgba(0, 20, 20, 0.8);
          box-shadow: 0 0 20px #00fff2;
        }
        h1 {
          color: #ff5555;
          text-shadow: 0 0 10px #ff5555;
        }
        p {
          font-size: 18px;
          margin: 20px 0;
        }
        .countdown {
          font-size: 24px;
          color: #00ffaa;
          font-weight: bold;
        }
        .link {
          color: #00fff2;
          text-decoration: underline;
          font-size: 20px;
        }
        .blink {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚫 DIRECT ACCESS BLOCKED</h1>
        <p>API cannot be accessed directly from browser.</p>
        <p>Please use the official website:</p>
        <p class="link blink">https://numspy.vercel.app</p>
        <p>Redirecting in <span id="countdown" class="countdown">5</span> seconds...</p>
        <p style="margin-top: 30px; font-size: 14px; color: #bff;">
          Developed by Happy 😊 | Contact: @Royal_smart_boy
        </p>
      </div>
      
      <script>
        let seconds = 5;
        const countdownElement = document.getElementById('countdown');
        
        const timer = setInterval(() => {
          seconds--;
          countdownElement.textContent = seconds;
          
          if (seconds <= 0) {
            clearInterval(timer);
            window.location.href = 'https://numspy.vercel.app';
          }
        }, 1000);
        
        // Auto redirect after 5 seconds
        setTimeout(() => {
          window.location.href = 'https://numspy.vercel.app';
        }, 5000);
      </script>
    </body>
    </html>
    `;

    // Send HTML response with redirect
    res.setHeader('Content-Type', 'text/html');
    return res.status(403).send(redirectHTML);
  }

  // NORMAL CORS FOR YOUR WEBSITE
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use GET request.'
    });
  }

  try {
    const { number } = req.query;
    
    if (!number) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(number)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit Indian phone number'
      });
    }

    const apiUrl = `https://multiservice.vishalboss.sbs/api.php?key=${API_KEY}&service=number&input=${number}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
      const uniqueRecords = removeDuplicateRecords(data.data);
      
      res.json({
        success: true,
        data: uniqueRecords,
        count: uniqueRecords.length,
        message: `Found ${uniqueRecords.length} record(s) for this number`,
        developer: 'Happy 😊',
        contact: '@Royal_smart_boy',
        privacy_notice: 'Protect your privacy at: https://otpal.vercel.app'
      });
      
    } else {
      res.json({
        success: false,
        message: 'No data found for this phone number',
        data: [],
        developer: 'Happy 😊'
      });
    }
    
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      developer: 'Happy 😊'
    });
  }
};

function removeDuplicateRecords(records) {
  const seen = new Set();
  const uniqueRecords = [];
  
  records.forEach(record => {
    const key = `${record.name || ''}-${record.fname || ''}-${record.circle || ''}-${record.address || ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueRecords.push(record);
    }
  });
  
  return uniqueRecords;
}

