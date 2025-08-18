<script>
    import { authenticate } from '$lib/auth.js';
    import { goto } from '$app/navigation';
    
    let password = '';
    let error = '';
    let loading = false;
    
    async function handleSubmit() {
        loading = true;
        error = '';
        
        if (authenticate(password)) {
            await goto('/');
        } else {
            error = 'Mot de passe incorrect';
            password = '';
        }
        
        loading = false;
    }
</script>

<svelte:head>
    <title>Authentification - Territoires Sensibles</title>
</svelte:head>

<div class="auth-container">
    <div class="auth-box">
        <div class="auth-header">
            <h1>🔒 Zone Protégée</h1>
            <p>Site en cours de développement</p>
        </div>
        
        <form on:submit|preventDefault={handleSubmit} class="auth-form">
            <div class="form-group">
                <label for="password">Mot de passe :</label>
                <input 
                    type="password" 
                    id="password" 
                    bind:value={password} 
                    placeholder="Entrez le mot de passe"
                    required
                    autocomplete="current-password"
                />
            </div>
            
            {#if error}
                <div class="error-message">
                    {error}
                </div>
            {/if}
            
            <button type="submit" disabled={loading || !password}>
                {loading ? 'Vérification...' : 'Accéder au site'}
            </button>
        </form>
        
        <div class="auth-footer">
            <p>Contactez l'administrateur pour obtenir l'accès</p>
        </div>
    </div>
</div>

<style lang="scss">
    .auth-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
    }
    
    .auth-box {
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        padding: 40px;
        max-width: 400px;
        width: 100%;
    }
    
    .auth-header {
        text-align: center;
        margin-bottom: 30px;
        
        h1 {
            color: #333;
            margin: 0 0 10px 0;
            font-size: 24px;
        }
        
        p {
            color: #666;
            margin: 0;
            font-size: 14px;
        }
    }
    
    .auth-form {
        .form-group {
            margin-bottom: 20px;
            
            label {
                display: block;
                margin-bottom: 8px;
                color: #333;
                font-weight: 500;
            }
            
            input {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e1e5e9;
                border-radius: 8px;
                font-size: 16px;
                transition: border-color 0.3s ease;
                
                &:focus {
                    outline: none;
                    border-color: #667eea;
                }
            }
        }
        
        button {
            width: 100%;
            padding: 14px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease;
            
            &:hover:not(:disabled) {
                background: #5a6fd8;
            }
            
            &:disabled {
                background: #ccc;
                cursor: not-allowed;
            }
        }
    }
    
    .error-message {
        background: #fee;
        color: #c33;
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 20px;
        text-align: center;
        border: 1px solid #fcc;
    }
    
    .auth-footer {
        text-align: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        
        p {
            color: #666;
            font-size: 12px;
            margin: 0;
        }
    }
</style>
