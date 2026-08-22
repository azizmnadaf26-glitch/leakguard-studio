from algosdk import account, mnemonic

private_key, address = account.generate_account()
passphrase = mnemonic.from_private_key(private_key)

print(f"ADDRESS={address}")
print(f"MNEMONIC={passphrase}")
