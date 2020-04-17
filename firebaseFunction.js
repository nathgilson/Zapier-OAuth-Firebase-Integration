  // endpoint 1
  express.get("/login", (req, res) => {
        const query = req.query
        if (query) {
            const urlWithCode = url.format({
                pathname: "https://[yourProject].com/oauth2",
                query
            })
            return res.status(200).redirect(urlWithCode)
        }
        return res.status(500).send(">> No response")
    })
    
    // endpoint 2
    express.post("/auth", (req, res) => {
        const { uid, redirect_uri, state } = req.body 
        
        return admin
            .auth()
            .createCustomToken(uid)
            .then((authToken) => {
                const urlWithCode = url.format({
                    pathname: redirect_uri,
                    query: { state, code: authToken }
                })
                return res.status(200).redirect(urlWithCode)
            })
            .catch((error) => {
                console.log("Error : ", error)
                res.status(500).send({ error })
            })
    })

// Endpoint 3
    express.post("/access", (req, res) => {
        const { client_id, token } = req.body
        const options = {
            method: "POST",
            url: "https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            form: {
                token,
                key: client_id
                returnSecureToken: "true"
            },
            json: true
        }
        return request(options, (error, response) => {
            if (error) {
                console.log(">> Error getting Access Token:", error)
                return res.status(500).send({ error })
            }
            const access_token = response.body.idToken
            return res.status(200).send({ access_token })
        })
    })
