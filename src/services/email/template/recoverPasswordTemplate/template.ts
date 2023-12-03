export const template = (name: string, code: number): string => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta http-equiv="content-type" content="text/html; charset=utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
          body {
            width: 800px;
            margin: 0;
            font-family: sans-serif;
          }
          .wallpaper {
            height: 50vh;
            background-color: #4199d9;
          }
          table {
            border-spacing: 0;
          }
          td {
            padding: 0;
          }
          img {
            border: 0;
          }
          .wrapper {
            display: flex;
            width: 100%;
            table-layout: fixed;
          }
          .main {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            border-spacing: 0;
            color: #000;
          }
          .card {
            margin: 20px;
            padding: 20px;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            border: 1px solid #f2f2f2;
          }
          .title {
            color: #262626
          }
          .text {
            color: #333333;
          }
          .code {
            text-align: center;
            text-decoration: underline;
            color: #4199D9;
          }
      </style>
    </head>
    <body>
      <center class="wrapper wallpaper">
        <table class="main" width="100%">
          <tr>
            <td>
              <div class="card">
                <h2 class="title">Password change request.</h2>
                <p class="text">
                  Hello ${name} there was a request to change your password at LuppoTW Weather.
                </p>
                <p class="text">
                  If you did not make this request, then ignore this email, otherwise,
                  use the code below to change your password:
                </p>
                <h3 class="code">${code}</h3>
              </div>
            </td>
          </tr>
        </table>
      </center>
    </body>
    </html>
  `

  return html
}
