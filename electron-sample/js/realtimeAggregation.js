const WebSocket = require('ws');

const RealtimeAggregation = {
    _socketUrl : 'wss://pubwss.bithumb.com/pub/ws',
    _socket: null,
    _isSocketConnected: false,
    _aggregationStartDate: null,
    _maxTradeCnt: null,
    _queue: null,
    _totalTradeCnt: 0,
    _totalTradeShowDiv: null,
    init () {
        this._totalTradeShowDiv = $('#totalTradeCount');
        this._initQueue();
        this._initDateTimePicker();
        this._bindEvents();
    },
    _initQueue () {
        this._queue = new Queue((data, cb) => {
            console.log('queue :: ', data);
            this._totalTradeCnt = Math.round((this._totalTradeCnt + data) * 1e12) / 1e12;
            if (this._totalTradeCnt > this._maxTradeCnt) {
                this._totalTradeShowDiv.css('color', 'red').text(this._totalTradeCnt);
                this._queue.destroy();
                this._closeSocket();
                setTimeout(() => {
                    alert(`최대 거래금액인 ${this._maxTradeCnt}를 넘었습니다.`);
                    this._alert('소켓 연결을 해제합니다.');
                }, 10);
            } else {
                this._totalTradeShowDiv.text(this._totalTradeCnt);
            }
            cb(null, true);
        });
    },
    _bindEvents () {
        $('#startBtn').click(this._onClickStartBtn.bind(this));
    },
    _onClickStartBtn () {
        const maxTradeCount = $('#maxTradeCount').val();
        const startDateTime = $('#startDateTime').val();

        if (!maxTradeCount || !startDateTime) {
            this._alert('모든 값을 입력해주세요.');
            return;
        }
        this._disableAllInputs();
        this._alertClose();
        this._connectSocket();

        this._aggregationStartDate = moment(startDateTime);
        this._maxTradeCnt = parseFloat(maxTradeCount);
    },
    _disableAllInputs () {
        $('#maxTradeCount').attr('readOnly', true);
        $('#startDateTime').attr('readOnly', true);
        $('#startBtn').attr('disabled', true);
    },
    _connectSocket () {
        this._socket = new WebSocket(this._socketUrl);
        this._socket.onopen = this._onOpenSocket.bind(this);
        this._socket.onclose = this._onCloseSocket.bind(this);

        const self = this;
        this._socket.onmessage = ({data}) => {
            let jsonData;
            try {
                jsonData = JSON.parse(data);
            } catch (e) {
                console.error(e);
                if (this._isSocketConnected) {
                    console.log('socket is already connected, so this error ignore');
                } else {
                    console.log('retry socket reconnect');
                    this._trySocketReconnect();
                }
                return;
            }

            self._onSocketMessage(jsonData);
        }
    },
    _trySocketReconnect () {
        if (this._socket) { this._closeSocket(); }
        this._onClickStartBtn();
    },
    _closeSocket () {
        this._socket.close();
        this._socket = null;
    },
    _onOpenSocket (e) {
        console.log('socket connect');
        const allCoins = '["BTC_KRW","ETH_KRW","DASH_KRW","LTC_KRW","ETC_KRW","XRP_KRW","BCH_KRW","XMR_KRW","ZEC_KRW","QTUM_KRW","BTG_KRW","EOS_KRW","ICX_KRW","TRX_KRW","ELF_KRW","MCO_KRW","OMG_KRW","KNC_KRW","GNT_KRW","ZIL_KRW","WAXP_KRW","POWR_KRW","LRC_KRW","STEEM_KRW","STRAT_KRW","AE_KRW","ZRX_KRW","REP_KRW","XEM_KRW","SNT_KRW","ADA_KRW","CTXC_KRW","BAT_KRW","WTC_KRW","THETA_KRW","LOOM_KRW","WAVES_KRW","ITC_KRW","TRUE_KRW","LINK_KRW","RNT_KRW","ENJ_KRW","PLY_KRW","VET_KRW","MTL_KRW","INS_KRW","IOST_KRW","TMTG_KRW","QKC_KRW","BZNT_KRW","HDAC_KRW","NPXS_KRW","LBA_KRW","WET_KRW","AMO_KRW","BSV_KRW","APIS_KRW","DAC_KRW","ORBS_KRW","VALOR_KRW","CON_KRW","ANKR_KRW","MIX_KRW","LAMB_KRW","CRO_KRW","FX_KRW","CHR_KRW","MBL_KRW","MXC_KRW","FAB_KRW","OGO_KRW","DVP_KRW","FCT_KRW","FNB_KRW","FZZ_KRW","TRV_KRW","PCM_KRW","DAD_KRW","AOA_KRW","XSR_KRW","WOM_KRW","SOC_KRW","EM_KRW","QBZ_KRW","BOA_KRW","WPX_KRW","FLETA_KRW","BNP_KRW","SXP_KRW","HC_KRW","BCD_KRW","XVG_KRW","XLM_KRW","PIVX_KRW","ETZ_KRW","GXC_KRW","BHP_KRW","BTT_KRW","HYC_KRW","VSYS_KRW","IPX_KRW","WICC_KRW","LUNA_KRW","AION_KRW"]';
        const requestType = '{"type":"transaction","symbols":["BTC_KRW","ETH_KRW","DASH_KRW","LTC_KRW","ETC_KRW","XRP_KRW","BCH_KRW","XMR_KRW","ZEC_KRW","QTUM_KRW","BTG_KRW","EOS_KRW","ICX_KRW","TRX_KRW","ELF_KRW","MCO_KRW","OMG_KRW","KNC_KRW","GNT_KRW","ZIL_KRW","WAXP_KRW","POWR_KRW","LRC_KRW","STEEM_KRW","STRAT_KRW","AE_KRW","ZRX_KRW","REP_KRW","XEM_KRW","SNT_KRW","ADA_KRW","CTXC_KRW","BAT_KRW","WTC_KRW","THETA_KRW","LOOM_KRW","WAVES_KRW","ITC_KRW","TRUE_KRW","LINK_KRW","RNT_KRW","ENJ_KRW","PLY_KRW","VET_KRW","MTL_KRW","INS_KRW","IOST_KRW","TMTG_KRW","QKC_KRW","BZNT_KRW","HDAC_KRW","NPXS_KRW","LBA_KRW","WET_KRW","AMO_KRW","BSV_KRW","APIS_KRW","DAC_KRW","ORBS_KRW","VALOR_KRW","CON_KRW","ANKR_KRW","MIX_KRW","LAMB_KRW","CRO_KRW","FX_KRW","CHR_KRW","MBL_KRW","MXC_KRW","FAB_KRW","OGO_KRW","DVP_KRW","FCT_KRW","FNB_KRW","FZZ_KRW","TRV_KRW","PCM_KRW","DAD_KRW","AOA_KRW","XSR_KRW","WOM_KRW","SOC_KRW","EM_KRW","QBZ_KRW","BOA_KRW","WPX_KRW","FLETA_KRW","BNP_KRW","SXP_KRW","HC_KRW","BCD_KRW","XVG_KRW","XLM_KRW","PIVX_KRW","ETZ_KRW","GXC_KRW","BHP_KRW","BTT_KRW","HYC_KRW","VSYS_KRW","IPX_KRW","WICC_KRW","LUNA_KRW","AION_KRW"]}';
        this._socket.send(requestType);
    },
    _onCloseSocket () {
        console.log('socket is closed');
    },
    _onSocketMessage (data) {
        console.log('data :: ', data);
        if (data && data.status === '0000') {
            const msg = data.resmsg;
            this._alert(msg);

            if (msg === 'Filter Registered Successfully') {
                this._isSocketConnected = true;
                $('#aggregationDiv').show();
            }
            return;
        }

        const tradeList = data.content && data.content.list;
        if (!tradeList) {
            console.log('trade data list is empty ', data);
            return;
        }

        for (const trade of tradeList) {
            if (!this._isTradeDateIsGreaterThanStartDate(trade.contDtm)) { continue; }
            this._queue.push(parseFloat(trade.contAmt));
        }
    },
    _isTradeDateIsGreaterThanStartDate (tradeDate) {
        return moment(tradeDate).isSameOrAfter(this._aggregationStartDate);
    },
    _initDateTimePicker () {
        $('#startDateTime').datetimepicker({
            format: 'YYYY-MM-DD HH:mm:ss'
        });
    },
    _alert (msg) {
        $('#alertDiv').text(msg).show()
    },
    _alertClose () {
        $('#alertDiv').hide();
    }
};
