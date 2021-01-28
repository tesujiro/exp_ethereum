mkdir:
	mkdir ./eth_private_net

init:
	geth --datadir ./eth_private_net init ./eth_private_net/myGenesis.json

start_console:
	geth --networkid "15" --nodiscover --datadir "./eth_private_net" console 2>> ./eth_private_net/geth_err.log

start:
	geth --networkid "15" --nodiscover --datadir "./eth_private_net" 2>> ./eth_private_net/geth_err.log &

console:
	geth --datadir "./eth_private_net" attach ipc:./eth_private_net/geth.ipc

stop:
	pkill -INT geth
